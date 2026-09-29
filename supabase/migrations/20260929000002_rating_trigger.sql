-- Aariva Voyages — Database Migration 2: Rating Maintenance Trigger
-- Automatically maintains packages.rating_avg and packages.review_count when reviews change

CREATE OR REPLACE FUNCTION public.update_package_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_package_id UUID;
    avg_rating NUMERIC(2, 1);
    total_reviews INTEGER;
BEGIN
    -- Determine which package needs recalculation
    IF (TG_OP = 'DELETE') THEN
        target_package_id := OLD.package_id;
    ELSE
        target_package_id := NEW.package_id;
    END IF;

    -- Calculate aggregates for approved reviews only
    SELECT
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0.0),
        COALESCE(COUNT(id), 0)
    INTO
        avg_rating,
        total_reviews
    FROM public.reviews
    WHERE package_id = target_package_id
      AND is_approved = true;

    -- Update package cache columns
    UPDATE public.packages
    SET
        rating_avg = avg_rating,
        review_count = total_reviews,
        updated_at = NOW()
    WHERE id = target_package_id;

    -- If UPDATE changed package_id, also recalculate the old package
    IF (TG_OP = 'UPDATE' AND OLD.package_id IS DISTINCT FROM NEW.package_id) THEN
        SELECT
            COALESCE(ROUND(AVG(rating)::numeric, 1), 0.0),
            COALESCE(COUNT(id), 0)
        INTO
            avg_rating,
            total_reviews
        FROM public.reviews
        WHERE package_id = OLD.package_id
          AND is_approved = true;

        UPDATE public.packages
        SET
            rating_avg = avg_rating,
            review_count = total_reviews,
            updated_at = NOW()
        WHERE id = OLD.package_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to reviews table
DROP TRIGGER IF EXISTS trg_update_package_rating_stats ON public.reviews;

CREATE TRIGGER trg_update_package_rating_stats
AFTER INSERT OR UPDATE OF rating, is_approved, package_id OR DELETE
ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_package_rating_stats();
