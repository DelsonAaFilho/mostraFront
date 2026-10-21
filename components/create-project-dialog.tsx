"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  LoaderCircle,
  Code2,
  HeartPulse,
  BookOpen,
  Wrench,
  Users,
  Atom,
  Palette,
  BriefcaseBusiness,
  Shapes,
  Sparkles,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Field } from "@/components/form-field";
import { PersonAvatar } from "@/components/person-avatar";
import { ProfessorSelect } from "@/components/professor-select";
import { useSite } from "@/components/site-provider";
import { courseAreas, type CourseArea, type Member } from "@/lib/types";
import { currentUser, professors } from "@/lib/data";
import { validateProject, type ProjectFields } from "@/lib/project-validation";
import { api } from "@/lib/services";
import { readableApiError } from "@/lib/api-client";

const areaIcons = [
  Code2,
  HeartPulse,
  BookOpen,
  Wrench,
  Users,
  Atom,
  Palette,
  BriefcaseBusiness,
  Shapes,
];
const initialFields: ProjectFields = {
  title: "",
  image: "",
  description: "",
  video: "",
  github: "",
  website: "",
  course: currentUser.course,
  professorId: "",
};

export function CreateProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [area, setArea] = useState<CourseArea | null>(null);
  const [step, setStep] = useState(1);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={step === 1 ? "area-dialog" : "project-dialog"}
        key={step}
      >
        <DialogHeader>
          <div className="dialog-step">
            <Sparkles size={16} />
            <span>MAKE ROOM FOR YOUR NEXT BIG IDEA</span>
            <span>{step} / 2</span>
          </div>
          <DialogTitle>
            {step === 1
              ? "What is your course area?"
              : "Bring your project to the lab."}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Every field has something to discover. Choose where your project belongs."
              : "Tell your story, credit your team, and share what you’ve been building."}
          </DialogDescription>
        </DialogHeader>
        {step === 1 ? (
          <>
            <div className="area-grid">
              {courseAreas.map((item, i) => {
                const Icon = areaIcons[i];
                return (
                  <button
                    key={item}
                    type="button"
                    className={`area-option ${area === item ? "chosen" : ""}`}
                    aria-pressed={area === item}
                    onClick={() => setArea(item)}
                  >
                    <Icon size={23} strokeWidth={1.5} />
                    <span>{item}</span>
                    {area === item ? (
                      <Check size={14} className="area-check" />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="area-dialog-footer">
              <span>You can share projects from any discipline.</span>
              <Button disabled={!area} onClick={() => setStep(2)}>
                Continue
                <ArrowRight size={16} />
              </Button>
            </div>
          </>
        ) : (
          <ProjectForm
            area={area!}
            onBack={() => setStep(1)}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProjectForm({
  area,
  onBack,
  onDone,
}: {
  area: CourseArea;
  onBack: () => void;
  onDone: () => void;
}) {
  const { notify, addProject } = useSite();
  const [values, setValues] = useState(initialFields);
  const [authors, setAuthors] = useState<Member[]>([{ ...currentUser }]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const errors = validateProject(
    values,
    authors,
    professors.map((professor) => professor.id),
  );
  function blur(key: string) {
    setTouched((previous) => ({ ...previous, [key]: true }));
  }
  function fieldError(key: string) {
    return touched[key] ? errors[key] : undefined;
  }
  function props(key: keyof ProjectFields) {
    return {
      id: key,
      name: key,
      value: values[key],
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) =>
        setValues((previous) => ({ ...previous, [key]: event.target.value })),
      onBlur: () => blur(key),
      "aria-invalid": !!fieldError(key),
      "aria-describedby":
        [
          fieldError(key) ? `${key}-error` : "",
          key === "image" ? "image-hint" : "",
        ]
          .filter(Boolean)
          .join(" ") || undefined,
    };
  }
  function updateAuthor(index: number, key: keyof Member, value: string) {
    setAuthors((previous) =>
      previous.map((author, i) =>
        i === index ? { ...author, [key]: value } : author,
      ),
    );
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    const checked = validateProject(
      values,
      authors,
      professors.map((professor) => professor.id),
    );
    setTouched(
      Object.fromEntries(Object.keys(checked).map((key) => [key, true])),
    );
    if (Object.keys(checked).length || pending) return;
    setPending(true);
    setError("");
    try {
      const project = await api.createProject({
        title: values.title.trim(),
        area,
        image: values.image.trim(),
        imageAlt: `Project image for ${values.title.trim()}`,
        description: values.description.trim().slice(0, 180),
        fullDescription: values.description.trim(),
        members: authors.map((author, i) => ({
          ...author,
          name: author.name.trim(),
          course:
            i === 0
              ? values.course.trim()
              : author.course || values.course.trim(),
        })),
        professor: professors.find(
          (professor) => professor.id === values.professorId,
        )!,
        github: values.github.trim(),
        website: values.website.trim() || undefined,
        video: values.video.trim() || undefined,
      });
      addProject(project);
      notify("Project created! Your idea is now part of the lab.");
      onDone();
    } catch (error) {
      setError(readableApiError(error));
    } finally {
      setPending(false);
    }
  }
  return (
    <form noValidate onSubmit={submit} className="project-form">
      <div className="project-form-scroll">
        <div className="project-form-top">
          <Badge variant="secondary">{area}</Badge>
          <span>
            <span className="required">*</span> Required fields
          </span>
        </div>
        <section className="form-section" aria-labelledby="project-basics">
          <h3 id="project-basics">
            <span>01</span>The big idea
          </h3>
          <Field
            id="title"
            label="Project title"
            required
            error={fieldError("title")}
          >
            <Input
              {...props("title")}
              required
              placeholder="Give your idea a name"
              maxLength={120}
            />
          </Field>
          <Field
            id="image"
            label="Project image URL"
            required
            error={fieldError("image")}
            hint="Image hosting suggestion: Imgur. Paste the direct URL of the hosted image here."
          >
            <Input
              {...props("image")}
              type="url"
              required
              placeholder="https://i.imgur.com/your-project.jpg"
            />
          </Field>
          <Field
            id="description"
            label="Project description"
            required
            error={fieldError("description")}
          >
            <Textarea
              {...props("description")}
              required
              placeholder="What are you exploring? Tell us about the problem, your approach, and the impact you hope to make."
              rows={4}
              minLength={20}
            />
          </Field>
          <div className="form-grid">
            <Field
              id="github"
              label="Project GitHub URL"
              required
              error={fieldError("github")}
            >
              <Input
                {...props("github")}
                type="url"
                required
                placeholder="https://github.com/team/project"
              />
            </Field>
            <Field
              id="website"
              label="Project website URL (optional)"
              error={fieldError("website")}
            >
              <Input
                {...props("website")}
                type="url"
                placeholder="https://your-project.com"
              />
            </Field>
          </div>
          <Field
            id="video"
            label="YouTube video URL (optional)"
            error={fieldError("video")}
          >
            <Input
              {...props("video")}
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Field>
        </section>
        <Separator />
        <section className="form-section" aria-labelledby="project-team">
          <h3 id="project-team">
            <span>02</span>The minds behind it
          </h3>
          <Field
            id="course"
            label="Main author’s course"
            required
            error={fieldError("course")}
          >
            <Input
              {...props("course")}
              required
              placeholder="e.g. Computer Science"
            />
          </Field>
          <div className="main-author-summary">
            <PersonAvatar name={currentUser.name} />
            <div>
              <strong>
                {currentUser.name}
                <Badge variant="secondary">You · Main author</Badge>
              </strong>
              <span>{currentUser.email}</span>
              <small>{values.course}</small>
            </div>
          </div>
          {authors.map((author, index) => (
            <div className="author-fields" key={index}>
              {index > 0 ? (
                <div className="additional-author-title">
                  <h4>Author {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove author ${index + 1}`}
                    onClick={() => {
                      setAuthors((previous) =>
                        previous.filter((_, i) => i !== index),
                      );
                      setTouched({});
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ) : null}
              {index > 0 ? (
                <div className="form-grid">
                  <Field
                    id={`author-${index}-name`}
                    label="Full name"
                    required
                    error={fieldError(`author-${index}-name`)}
                  >
                    <Input
                      id={`author-${index}-name`}
                      required
                      value={author.name}
                      onChange={(event) =>
                        updateAuthor(index, "name", event.target.value)
                      }
                      onBlur={() => blur(`author-${index}-name`)}
                      aria-invalid={!!fieldError(`author-${index}-name`)}
                      aria-describedby={
                        fieldError(`author-${index}-name`)
                          ? `author-${index}-name-error`
                          : undefined
                      }
                      placeholder="Author’s full name"
                    />
                  </Field>
                  <Field
                    id={`author-${index}-course`}
                    label="Course (optional)"
                  >
                    <Input
                      id={`author-${index}-course`}
                      value={author.course}
                      onChange={(event) =>
                        updateAuthor(index, "course", event.target.value)
                      }
                      placeholder={values.course}
                    />
                  </Field>
                </div>
              ) : null}
              <div className="form-grid">
                {(["github", "linkedin"] as const).map((key) => {
                  const id = `author-${index}-${key}`;
                  return (
                    <Field
                      key={key}
                      id={id}
                      label={`${key === "github" ? "GitHub" : "LinkedIn"} profile URL`}
                      required
                      error={fieldError(id)}
                    >
                      <Input
                        id={id}
                        type="url"
                        required
                        value={author[key]}
                        placeholder={`https://${key === "github" ? "github.com/username" : "linkedin.com/in/username"}`}
                        onChange={(event) =>
                          updateAuthor(index, key, event.target.value)
                        }
                        onBlur={() => blur(id)}
                        aria-invalid={!!fieldError(id)}
                        aria-describedby={
                          fieldError(id) ? `${id}-error` : undefined
                        }
                      />
                    </Field>
                  );
                })}
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setAuthors((previous) => [
                ...previous,
                { name: "", course: "", github: "", linkedin: "" },
              ])
            }
          >
            <Plus size={16} />
            Add author
          </Button>
        </section>
        <Separator />
        <section className="form-section" aria-labelledby="project-professor">
          <h3 id="project-professor">
            <span>03</span>A little guidance goes a long way
          </h3>
          <Field
            id="professorId"
            label="Assigned professor"
            required
            error={fieldError("professorId")}
          >
            <ProfessorSelect
              value={values.professorId}
              onChange={(professorId) =>
                setValues((previous) => ({ ...previous, professorId }))
              }
              error={fieldError("professorId")}
              onBlur={() => blur("professorId")}
            />
          </Field>
          <p className="field-hint">
            Choose a registered professor. Their name and email will appear on
            your project.
          </p>
        </section>
        {error ? (
          <p className="form-alert" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <div className="project-form-footer">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={pending}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <span>Ready to inspire someone?</span>
        <Button
          type="submit"
          disabled={pending || Object.keys(errors).length > 0}
        >
          {pending ? (
            <LoaderCircle className="animate-spin" size={16} />
          ) : (
            <Plus size={16} />
          )}
          {pending ? "Publishing…" : "Publish project"}
        </Button>
      </div>
    </form>
  );
}
