import ContactForm from "../components/ContactForm";
import ContactList from "@/components/ContactList";
import { getContacts } from "@/services/contactService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookUser } from "lucide-react";

const IndexQuery = () => {
  const queryClient = useQueryClient();
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  const invalidateContacts = () =>
    queryClient.invalidateQueries({ queryKey: ["contacts"] });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookUser className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Contact Manager</h1>
              <p className="text-sm text-muted-foreground">
                Manage your contacts efficiently
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ContactForm onContactAdded={invalidateContacts} />
          </div>
          <div>
            <ContactList contacts={contacts} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Contact Management App — Built with React & Tailwind CSS
        </div>
      </footer>
    </div>
  );
};

export default IndexQuery;
