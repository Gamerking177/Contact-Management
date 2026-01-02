import { Contact, ContactFormData } from "@/types/contact";
import api from "@/services/api";
import { toast } from "react-toastify";

const STORAGE_KEY = "contacts";

// Simulates API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get all contacts from localStorage
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const res = await api.get("/api/contacts");
    const items = Array.isArray(res.data) ? res.data : [];
    return items.map((dto: any) => ({
      id: dto._id || dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      message: dto.message,
      createdAt: new Date(dto.createdAt),
    }));
  } catch (err: any) {
    const message = err?.response?.data?.message || "Failed to fetch contacts";
    toast.error(message);
    throw err;
  }
};

// Create a new contact
export const createContact = async (
  data: ContactFormData
): Promise<Contact> => {
  try {
    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message?.trim() || undefined,
    };
    const res = await api.post("/api/contacts", payload);
    const dto = res.data;
    const contact: Contact = {
      id: dto._id || dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      message: dto.message,
      createdAt: new Date(dto.createdAt),
    };
    toast.success("Contact added successfully");
    return contact;
  } catch (err: any) {
    const message = err?.response?.data?.message || "Failed to add contact";
    toast.error(message);
    throw err;
  }
};

// Delete a contact by ID
export const deleteContact = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/contacts/${id}`);
    toast.success("Contact deleted");
  } catch (err: any) {
    const message = err?.response?.data?.message || "Failed to delete contact";
    toast.error(message);
    throw err;
  }
};
