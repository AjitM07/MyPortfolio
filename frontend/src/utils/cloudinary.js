/**
 * Converts a Cloudinary raw-upload URL into a forced-download URL by
 * injecting the fl_attachment transformation into the URL path.
 *
 * Cloudinary raw files do NOT support ?fl_attachment as a query param —
 * the flag must be a path transformation inserted before the version segment.
 *
 * Input:  https://res.cloudinary.com/{cloud}/raw/upload/v123/folder/file.pdf
 * Output: https://res.cloudinary.com/{cloud}/raw/upload/fl_attachment:Ajit_Resume.pdf/v123/folder/file.pdf
 *
 * @param {string} url       - Raw Cloudinary URL from the DB
 * @param {string} filename  - Filename the browser should save as (default: Ajit_Resume.pdf)
 * @returns {string} Download URL
 */
export function makeCloudinaryDownloadUrl(url, filename = 'Ajit_Resume.pdf') {
  if (!url) return '#';

  // Insert fl_attachment before the version segment (v followed by digits)
  const transformed = url.replace(
    /\/upload\/(v\d+\/)/,
    `/upload/fl_attachment:${filename}/$1`
  );

  // If the URL didn't match the expected pattern (e.g. no version), fall back gracefully
  return transformed !== url ? transformed : `${url}?fl_attachment=${filename}`;
}
