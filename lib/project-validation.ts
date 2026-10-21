import { validUrl, youtubeEmbed } from "@/lib/validation";
import type { Member } from "@/lib/types";

export interface ProjectFields {
  title: string;
  image: string;
  description: string;
  video: string;
  github: string;
  website: string;
  course: string;
  professorId: string;
}
export function validateProject(
  values: ProjectFields,
  authors: Member[],
  professorIds: string[],
) {
  const errors: Record<string, string> = {};
  if (values.title.trim().length < 2)
    errors.title = "Give your project a title of at least 2 characters.";
  if (!validUrl(values.image))
    errors.image =
      "Enter a direct image URL starting with https:// or http://.";
  if (values.description.trim().length < 20)
    errors.description =
      "Tell us about your project in at least 20 characters.";
  if (!validUrl(values.github, "github.com"))
    errors.github = "Enter a valid GitHub repository URL.";
  if (values.website && !validUrl(values.website))
    errors.website = "Enter a valid website URL, including https://.";
  if (values.video && !youtubeEmbed(values.video))
    errors.video = "Enter a valid YouTube video URL.";
  if (values.course.trim().length < 2)
    errors.course = "Enter the main author’s course.";
  if (!professorIds.includes(values.professorId))
    errors.professorId = "Choose a registered professor.";
  authors.forEach((author, i) => {
    if (author.name.trim().length < 2)
      errors[`author-${i}-name`] =
        "Enter the author’s name (at least 2 characters).";
    if (!validUrl(author.github, "github.com"))
      errors[`author-${i}-github`] = "Enter a valid GitHub profile URL.";
    if (!validUrl(author.linkedin, "linkedin.com"))
      errors[`author-${i}-linkedin`] = "Enter a valid LinkedIn profile URL.";
  });
  return errors;
}
