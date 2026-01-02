import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/InputField";
import { ContactFormData, FormErrors } from "@/types/contact";
import { validateForm, isFormValid } from "@/utils/validation";
import api from "@/services/api";
import { toast } from "react-toastify";
import { Loader2, UserPlus } from "lucide-react";

interface ContactFormProps {
  onContactAdded: () => void;
}

const ContactForm = ({ onContactAdded }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validate on change
    const newFormData = { ...formData, [field]: value };
    const newErrors = validateForm(newFormData);
    setErrors(newErrors);
    
    // Reset status on change
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, phone: true, message: true });
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (!isFormValid(validationErrors)) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      await api.post("/api/contacts", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message?.trim() || undefined,
      });
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTouched({});
      setErrors({});
      onContactAdded();
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
      toast.success("Contact added successfully");
    } catch (err: any) {
      setSubmitStatus("error");
      const message = err?.response?.data?.message || "Failed to add contact";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentErrors = validateForm(formData);
  const canSubmit = isFormValid(currentErrors) && formData.name && formData.email && formData.phone;

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <UserPlus className="h-5 w-5" />
          Add New Contact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <InputField
            label="Name"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(value) => handleChange("name", value)}
            error={touched.name ? errors.name : undefined}
            required
          />
          
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            error={touched.email ? errors.email : undefined}
            required
          />
          
          <InputField
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            error={touched.phone ? errors.phone : undefined}
            required
          />
          
          <InputField
            label="Message"
            name="message"
            type="textarea"
            placeholder="Enter optional message..."
            value={formData.message}
            onChange={(value) => handleChange("message", value)}
          />
          
          {submitStatus === "success" && (
            <div className="rounded-md bg-accent p-3 text-sm text-accent-foreground border border-border">
              ✓ Contact added successfully!
            </div>
          )}
          
          {submitStatus === "error" && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              ✗ Failed to add contact. Please try again.
            </div>
          )}
          
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Contact...
              </>
            ) : (
              "Add Contact"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
