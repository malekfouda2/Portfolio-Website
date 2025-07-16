import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Settings,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  LogOut
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { HeroContent, Contact, Project } from "@shared/schema";
import { ImageUpload } from "@/components/ImageUpload";

// Auth check hook
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLocation("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [setLocation]);

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setLocation("/login");
  };

  return { isAuthenticated, logout };
}

function HeroContentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<HeroContent>>({});

  const { data: heroContent, isLoading } = useQuery({
    queryKey: ["/api/admin/hero"],
    onSuccess: (data) => {
      if (data) {
        setFormData(data);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<HeroContent>) => {
      const response = await apiRequest("PUT", "/api/admin/hero", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Hero content updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero"] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update hero content",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hero Section</CardTitle>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-sm text-muted-foreground">{heroContent?.name || "Not set"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Title</Label>
              <p className="text-sm text-muted-foreground">{heroContent?.title || "Not set"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground">{heroContent?.description || "Not set"}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Years Experience</Label>
                <p className="text-sm text-muted-foreground">{heroContent?.yearsExperience || 0}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Projects Delivered</Label>
                <p className="text-sm text-muted-foreground">{heroContent?.projectsDelivered || 0}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Client Satisfaction</Label>
                <p className="text-sm text-muted-foreground">{heroContent?.clientSatisfaction || 0}%</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Your professional title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description about yourself"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="yearsExperience">Years Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  value={formData.yearsExperience || ""}
                  onChange={(e) => handleInputChange("yearsExperience", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="projectsDelivered">Projects Delivered</Label>
                <Input
                  id="projectsDelivered"
                  type="number"
                  value={formData.projectsDelivered || ""}
                  onChange={(e) => handleInputChange("projectsDelivered", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="clientSatisfaction">Client Satisfaction (%)</Label>
                <Input
                  id="clientSatisfaction"
                  type="number"
                  value={formData.clientSatisfaction || ""}
                  onChange={(e) => handleInputChange("clientSatisfaction", parseInt(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="typingTexts">Typing Animation Texts (one per line)</Label>
              <Textarea
                id="typingTexts"
                value={Array.isArray(formData.typingTexts) ? formData.typingTexts.join("\n") : ""}
                onChange={(e) => handleInputChange("typingTexts", e.target.value.split("\n").filter(Boolean))}
                placeholder="Building scalable web applications&#10;Creating elegant user interfaces&#10;Solving complex technical challenges"
                rows={4}
              />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function ContactsManager() {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["/api/admin/contacts"],
  });

  if (isLoading) return <div>Loading contacts...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {!contacts?.length ? (
          <p className="text-muted-foreground">No contact submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact: Contact) => (
              <div key={contact.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">{contact.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProjectsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      const response = await apiRequest("POST", "/api/admin/projects", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setIsCreating(false);
      setFormData({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Project> }) => {
      const response = await apiRequest("PUT", `/api/admin/projects/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setIsEditing(null);
      setFormData({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/projects/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      createMutation.mutate(formData);
    } else if (isEditing) {
      updateMutation.mutate({ id: isEditing, data: formData });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const startEdit = (project: Project) => {
    setIsEditing(project.id);
    setFormData(project);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setIsCreating(false);
    setFormData({});
  };

  if (isLoading) return <div>Loading projects...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </CardHeader>
      <CardContent>
        {(isCreating || isEditing) && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {isCreating ? "Create New Project" : "Edit Project"}
              </h3>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Project title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Project description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                value={Array.isArray(formData.technologies) ? formData.technologies.join(", ") : ""}
                onChange={(e) => handleInputChange("technologies", e.target.value.split(",").map(t => t.trim()))}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
            <div>
              <ImageUpload
                label="Project Image"
                value={formData.image || ""}
                onChange={(url) => handleInputChange("image", url)}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select 
                id="type" 
                value={formData.type || "portfolio"}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="portfolio">Portfolio</option>
                <option value="live">Live</option>
              </select>
            </div>
            <div>
              <Label htmlFor="url">URL (if live)</Label>
              <Input
                id="url"
                value={formData.url || ""}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Project"}
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {projects?.map((project: Project) => (
            <div key={project.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex gap-1 mt-2">
                    {project.technologies?.map((tech, index) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={project.type === "live" ? "default" : "outline"}>
                      {project.type}
                    </Badge>
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(project)}
                    disabled={isEditing !== null || isCreating}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(project.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome back, Malek</span>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <Home className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="hero">
              <Users className="h-4 w-4 mr-2" />
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderOpen className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Portfolio projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">New messages</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Years Experience</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3+</div>
                  <p className="text-xs text-muted-foreground">Professional experience</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Project
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Hero Section
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Website
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <HeroContentManager />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}