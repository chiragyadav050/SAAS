import { TemplateForm } from "@/components/templates/template-form";

export default function NewTemplatePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a custom AI prompt template for generating documents.
        </p>
      </div>
      <TemplateForm />
    </div>
  );
}
