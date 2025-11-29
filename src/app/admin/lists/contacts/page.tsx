"use client";

import { useState, useEffect } from "react";
import { Search, User, Phone, Mail, Briefcase, MapPin, School } from "lucide-react";
import PageContainer from "@/components/layouts/PageContainer";
import PageHeader from "@/components/layouts/PageHeader";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Import mock data
import schoolsData from "@/lib/mock-data/schools.json";

interface ContactPerson {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  schoolId: string;
  schoolName: string;
  city: string;
  board: string;
}

export default function ContactPersonListPage() {
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactPerson[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    // Extract all contacts from schools
    const allContacts: ContactPerson[] = [];

    schoolsData.forEach((school) => {
      school.contacts.forEach((contact) => {
        allContacts.push({
          id: contact.id,
          name: contact.name,
          role: contact.role,
          phone: contact.phone,
          email: contact.email,
          schoolId: school.id,
          schoolName: school.name,
          city: school.city,
          board: school.board,
        });
      });
    });

    setContacts(allContacts);
    setFilteredContacts(allContacts);
  }, []);

  useEffect(() => {
    let filtered = contacts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.phone.includes(searchQuery) ||
          contact.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((contact) => contact.role === roleFilter);
    }

    // City filter
    if (cityFilter !== "all") {
      filtered = filtered.filter((contact) => contact.city === cityFilter);
    }

    setFilteredContacts(filtered);
  }, [searchQuery, roleFilter, cityFilter, contacts]);

  // Get unique roles and cities for filters
  const roles = Array.from(new Set(contacts.map((c) => c.role))).sort();
  const cities = Array.from(new Set(contacts.map((c) => c.city))).sort();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Contact Person List"
          description={`Complete list of ${contacts.length} contact persons`}
        />

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-muted-foreground">
                {filteredContacts.length} contacts found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[80px]">ID</TableHead>
                    <TableHead className="min-w-[180px]">Name</TableHead>
                    <TableHead className="min-w-[150px]">Role</TableHead>
                    <TableHead className="min-w-[150px]">Phone</TableHead>
                    <TableHead className="min-w-[220px]">Email</TableHead>
                    <TableHead className="min-w-[200px]">School</TableHead>
                    <TableHead className="min-w-[120px]">City</TableHead>
                    <TableHead className="min-w-[80px]">Board</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No contacts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="font-medium">{contact.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            <Badge variant="secondary">{contact.role}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{contact.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{contact.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <School className="h-3.5 w-3.5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{contact.schoolName}</p>
                              <p className="text-xs text-muted-foreground">{contact.schoolId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            {contact.city}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{contact.board}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
