import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, Edit, Trash2, Plus, Save, X } from "lucide-react";
import { format } from "date-fns";

// Hero Content Management
function HeroContentManager() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    typingTexts: [] as string[],
    description: "",
    yearsExperience: 0,
    projectsDelivered: 0,
    clientSatisfaction: 0,
  });

  const { data: heroContent, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/hero"],
  });

  const handleEdit = () => {
    if (heroContent) {
      setFormData({
        name: heroContent.name || "",
        title: heroContent.title || "",
        typingTexts: heroContent.typingTexts || [],
        description: heroContent.description || "",
        yearsExperience: heroContent.yearsExperience || 0,
        projectsDelivered: heroContent.projectsDelivered || 0,
        clientSatisfaction: heroContent.clientSatisfaction || 0,
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        refetch();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save hero content:", error);
    }
  };

  if (isLoading) return <div>Loading hero content...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Hero Section
          {!isEditing && (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Manage the hero section content and statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="typingTexts">Typing Texts (comma-separated)</Label>
              <Input
                id="typingTexts"
                value={formData.typingTexts.join(", ")}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  typingTexts: e.target.value.split(",").map(t => t.trim())
                })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="yearsExperience">Years Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="projectsDelivered">Projects Delivered</Label>
                <Input
                  id="projectsDelivered"
                  type="number"
                  value={formData.projectsDelivered}
                  onChange={(e) => setFormData({ ...formData, projectsDelivered: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="clientSatisfaction">Client Satisfaction %</Label>
                <Input
                  id="clientSatisfaction"
                  type="number"
                  value={formData.clientSatisfaction}
                  onChange={(e) => setFormData({ ...formData, clientSatisfaction: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{heroContent?.name || "No name set"}</h3>
              <p className="text-muted-foreground">{heroContent?.title || "No title set"}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Typing Texts:</h4>
              <div className="flex flex-wrap gap-1">
                {heroContent?.typingTexts?.map((text: string, index: number) => (
                  <Badge key={index} variant="secondary">{text}</Badge>
                )) || <span className="text-muted-foreground">No typing texts set</span>}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Description:</h4>
              <p className="text-sm text-muted-foreground">{heroContent?.description || "No description set"}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{heroContent?.yearsExperience || 0}+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{heroContent?.projectsDelivered || 0}+</div>
                <div className="text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{heroContent?.clientSatisfaction || 0}%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Contacts Management
function ContactsManager() {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["/api/admin/contacts"],
  });

  if (isLoading) return <div>Loading contacts...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
        <CardDescription>
          Messages received through the contact form
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {contacts?.length ? (
            <div className="space-y-4">
              {contacts.map((contact: any) => (
                <div key={contact.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{contact.name}</span>
                      <Badge variant="outline">{contact.email}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(contact.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No contact form submissions yet
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Projects Management
function ProjectsManager() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
  });

  if (isLoading) return <div>Loading projects...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Projects
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardTitle>
        <CardDescription>
          Manage your portfolio projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {projects?.length ? (
            <div className="space-y-4">
              {projects.map((project: any) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <Badge variant={project.type === "live" ? "default" : "secondary"}>
                        {project.type}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies?.map((tech: string, index: number) => (
                      <Badge key={index} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No projects added yet
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Portfolio Dashboard</h1>
        <p className="text-muted-foreground">
          Manage all aspects of your portfolio website
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Badge variant="secondary">Active</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+8 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skills Listed</CardTitle>
                <Badge variant="outline">Tech Stack</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">Across 6 categories</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hero">
          <HeroContentManager />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsManager />
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills Management</CardTitle>
              <CardDescription>Coming soon...</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="partnerships">
          <Card>
            <CardHeader>
              <CardTitle>Partnerships Management</CardTitle>
              <CardDescription>Coming soon...</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}