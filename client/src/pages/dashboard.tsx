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
  LogOut,
  CheckCircle,
  Check
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Hero Section</CardTitle>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white" : "bg-green-600 hover:bg-green-700 text-white"}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-300">Name</Label>
              <p className="text-sm text-gray-400">{heroContent?.name || "Not set"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-300">Title</Label>
              <p className="text-sm text-gray-400">{heroContent?.title || "Not set"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-300">Description</Label>
              <p className="text-sm text-gray-400">{heroContent?.description || "Not set"}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-300">Years Experience</Label>
                <p className="text-sm text-gray-400">{heroContent?.yearsExperience || 0}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-300">Projects Delivered</Label>
                <p className="text-sm text-gray-400">{heroContent?.projectsDelivered || 0}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-300">Client Satisfaction</Label>
                <p className="text-sm text-gray-400">{heroContent?.clientSatisfaction || 0}%</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your name"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="title" className="text-gray-300">Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Your professional title"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description about yourself"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="yearsExperience" className="text-gray-300">Years Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  value={formData.yearsExperience || ""}
                  onChange={(e) => handleInputChange("yearsExperience", parseInt(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="projectsDelivered" className="text-gray-300">Projects Delivered</Label>
                <Input
                  id="projectsDelivered"
                  type="number"
                  value={formData.projectsDelivered || ""}
                  onChange={(e) => handleInputChange("projectsDelivered", parseInt(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="clientSatisfaction" className="text-gray-300">Client Satisfaction (%)</Label>
                <Input
                  id="clientSatisfaction"
                  type="number"
                  value={formData.clientSatisfaction || ""}
                  onChange={(e) => handleInputChange("clientSatisfaction", parseInt(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="typingTexts" className="text-gray-300">Typing Animation Texts (one per line)</Label>
              <Textarea
                id="typingTexts"
                value={Array.isArray(formData.typingTexts) ? formData.typingTexts.join("\n") : ""}
                onChange={(e) => handleInputChange("typingTexts", e.target.value.split("\n").filter(Boolean))}
                placeholder="Building scalable web applications&#10;Creating elegant user interfaces&#10;Solving complex technical challenges"
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
            <Button type="submit" disabled={updateMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white">
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["/api/admin/contacts"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/contacts/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/contacts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-600 text-white";
      case "contacted":
        return "bg-yellow-600 text-white";
      case "resolved":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  if (isLoading) return <div className="text-white">Loading contacts...</div>;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Contact Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {!contacts?.length ? (
          <p className="text-gray-400">No contact submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact: any) => (
              <div key={contact.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-white">{contact.name}</h4>
                      <Badge className={getStatusColor(contact.status || "new")}>
                        {contact.status?.charAt(0).toUpperCase() + contact.status?.slice(1) || "New"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-3">
                      <p className="text-sm text-gray-300">{contact.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {contact.status !== "contacted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatusMutation.mutate({ id: contact.id, status: "contacted" })}
                        disabled={updateStatusMutation.isPending}
                        className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Contacted
                      </Button>
                    )}
                    
                    {contact.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatusMutation.mutate({ id: contact.id, status: "resolved" })}
                        disabled={updateStatusMutation.isPending}
                        className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark Resolved
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(contact.id)}
                      disabled={deleteMutation.isPending}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
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
    
    // Ensure required fields are present
    const projectData = {
      ...formData,
      type: formData.type || "personal", // Default to personal if not set
      technologies: Array.isArray(formData.technologies) ? formData.technologies : [],
      image: formData.image || "",
    };
    
    if (isCreating) {
      createMutation.mutate(projectData);
    } else if (isEditing) {
      updateMutation.mutate({ id: isEditing, data: projectData });
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
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Projects</CardTitle>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </CardHeader>
      <CardContent>
        {(isCreating || isEditing) && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">
                {isCreating ? "Create New Project" : "Edit Project"}
              </h3>
              <Button type="button" variant="outline" onClick={cancelEdit} className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor="title" className="text-gray-300">Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Project title"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Project description"
                rows={3}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-gray-300">Project Type</Label>
              <Select
                value={formData.type || "personal"}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="personal" className="text-gray-200 hover:bg-gray-700">Personal Project</SelectItem>
                  <SelectItem value="freelance" className="text-gray-200 hover:bg-gray-700">Freelance Work</SelectItem>
                  <SelectItem value="company" className="text-gray-200 hover:bg-gray-700">Company Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="technologies" className="text-gray-300">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                value={Array.isArray(formData.technologies) ? formData.technologies.join(", ") : ""}
                onChange={(e) => handleInputChange("technologies", e.target.value.split(",").map(t => t.trim()))}
                placeholder="React, Node.js, PostgreSQL"
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
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
              <Label htmlFor="type" className="text-gray-300">Type</Label>
              <select 
                id="type" 
                value={formData.type || "personal"}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              >
                <option value="personal">Personal</option>
                <option value="freelance">Freelance</option>
                <option value="company">Company</option>
              </select>
            </div>

            {/* Company Information - Only show if type is 'company' */}
            {formData.type === 'company' && (
              <>
                <div>
                  <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName || ""}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="e.g., Soliman's Enterprise"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="companyUrl" className="text-gray-300">Company Website</Label>
                  <Input
                    id="companyUrl"
                    value={formData.companyUrl || ""}
                    onChange={(e) => handleInputChange("companyUrl", e.target.value)}
                    placeholder="https://company.com"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="text-gray-300">Your Role</Label>
                  <Input
                    id="role"
                    value={formData.role || ""}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    placeholder="e.g., Full-Stack Developer, Frontend Lead"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="url" className="text-gray-300">URL (if live)</Label>
              <Input
                id="url"
                value={formData.url || ""}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="https://example.com"
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Project"}
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {projects?.map((project: Project) => (
            <div key={project.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-white">{project.title}</h4>
                  <p className="text-sm text-gray-400">{project.description}</p>
                  <div className="flex gap-1 mt-2">
                    {project.technologies?.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={project.type === "company" ? "default" : "outline"} 
                           className={project.type === "company" ? "bg-purple-600 text-white" : "border-gray-600 text-gray-300"}>
                      {project.type === 'personal' ? 'Personal' : 
                       project.type === 'company' ? 'Company' : 'Freelance'}
                    </Badge>
                    
                    {/* Company Credit */}
                    {project.companyName && (
                      <span className="text-xs text-gray-400">
                        @ {project.companyName}
                      </span>
                    )}
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
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
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(project.id)}
                    disabled={deleteMutation.isPending}
                    className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
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
    return <div className="text-white">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-gray-400">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Welcome back, Malek</span>
              <Button variant="outline" onClick={logout} className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-gray-700">
              <Home className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="hero" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-gray-700">
              <Users className="h-4 w-4 mr-2" />
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-gray-700">
              <FolderOpen className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-gray-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">0</div>
                  <p className="text-xs text-gray-500">Portfolio projects</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Contact Submissions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">0</div>
                  <p className="text-xs text-gray-500">New messages</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Years Experience</CardTitle>
                  <Calendar className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">3+</div>
                  <p className="text-xs text-gray-500">Professional experience</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Project
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Hero Section
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
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