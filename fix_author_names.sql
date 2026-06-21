-- Update existing reviews where author_name is an email
UPDATE reviews
SET author_name = p.full_name
FROM profiles p
WHERE reviews.customer_id = p.id 
  AND reviews.author_name LIKE '%@%'
  AND p.full_name IS NOT NULL
  AND p.full_name != '';

-- If full_name is null, fallback to the part of the email before the @
UPDATE reviews
SET author_name = split_part(author_name, '@', 1)
WHERE author_name LIKE '%@%';
