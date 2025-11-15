import React, { useState, useEffect } from "react";
import {
  Plus,
  LogOut,
  Users,
  Folder,
  CheckSquare,
  MessageSquare,
  Badge,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Search,
  Filter,
  Circle,
} from "lucide-react";
import { useAuth } from "@/services/context/auth";
import type { Project, Task, User as UserType } from "@/types";
import { projectsAPI } from "@/services/api/project";
import { tasksAPI } from "@/services/api/task";
import { messagesAPI } from "@/services/api/message";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usersAPI } from "@/services/api/user";
import { useSocket } from "@/services/socket/socket";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Add to your existing state variables
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [teamUsers, setTeamUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "tasks" | "messages"
  >("overview");

  // Project states
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showViewProject, setShowViewProject] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Task states
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showViewTask, setShowViewTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  console.log(user);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  const [editingProject, setEditingProject] = useState({
    name: "",
    description: "",
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as "todo" | "in-progress" | "done",
    projectId: "",
    assignedTo: "",
  });

  const [editingTask, setEditingTask] = useState({
    title: "",
    description: "",
    status: "todo" as "todo" | "in-progress" | "done",
    projectId: "",
    assignedTo: "",
  });

  // Filter states
  const [taskFilter, setTaskFilter] = useState({
    projectId: "",
    status: "",
    assignedTo: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [creatingProject, setCreatingProject] = useState(false);
  const [updatingProject, setUpdatingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);

  // Call the hook at top-level
  const { isConnected, messages } = useSocket();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch projects
      const projectsResponse = await projectsAPI.getAll();
      setProjects(projectsResponse.data);

      const allTasks: Task[] = [];

      try {
        const tasksResponse = await tasksAPI.getTasks();
        allTasks.push(...tasksResponse.data);
      } catch (error) {}

      setTasks(allTasks);

      // Fetch team users
      if (user?.teamId) {
        const usersResponse = await usersAPI.getByTeam(user.teamId);
        setTeamUsers(usersResponse.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send message function
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.teamId) return;

    try {
      setSendingMessage(true);
      await messagesAPI.send({
        content: newMessage,
        teamId: user.teamId,
      });

      setNewMessage(""); // Clear the input
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle Enter key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Project CRUD operations
  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;

    try {
      setCreatingProject(true);
      const response = await projectsAPI.create({
        ...newProject,
        teamId: user?.teamId,
      });

      setProjects((prev) => [response.data, ...prev]);
      setNewProject({ name: "", description: "" });
      setShowCreateProject(false);

      await fetchDashboardData();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleEditProject = async () => {
    if (!selectedProject || !editingProject.name.trim()) return;

    try {
      setUpdatingProject(true);
      const response = await projectsAPI.update(
        selectedProject._id,
        editingProject
      );

      setProjects((prev) =>
        prev.map((project) =>
          project._id === selectedProject._id ? response.data : project
        )
      );
      setShowEditProject(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setUpdatingProject(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      setDeletingProject(true);
      await projectsAPI.delete(selectedProject._id);

      setProjects((prev) =>
        prev.filter((project) => project._id !== selectedProject._id)
      );
      setTasks((prev) =>
        prev.filter((task) => task.project?._id !== selectedProject._id)
      );
      setShowDeleteProject(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setDeletingProject(false);
    }
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowViewProject(true);
    // fetchProjectTasks();
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setEditingProject({
      name: project.name,
      description: project.description || "",
    });
    setShowEditProject(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteProject(true);
  };

  // Task CRUD operations
  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !newTask.projectId) return;

    try {
      setCreatingTask(true);
      const response = await tasksAPI.create({
        ...newTask,
        assignedTo: newTask.assignedTo || undefined,
      });

      setTasks((prev) => [response.data, ...prev]);
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        projectId: "",
        assignedTo: "",
      });
      setShowCreateTask(false);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setCreatingTask(false);
    }
  };

  const handleEditTask = async () => {
    if (!selectedTask || !editingTask.title.trim() || !editingTask.projectId)
      return;

    try {
      setUpdatingTask(true);
      const response = await tasksAPI.update(selectedTask._id, {
        ...editingTask,
        assignedTo: editingTask.assignedTo || undefined,
      });

      setSelectedTask(response.data);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? response.data : task
        )
      );
      setShowEditTask(false);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setUpdatingTask(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      setDeletingTask(true);
      await tasksAPI.delete(selectedTask._id);

      setTasks((prev) => prev.filter((task) => task._id !== selectedTask._id));
      setShowDeleteTask(false);
      setShowViewTask(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeletingTask(false);
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowViewTask(true);
  };

  const handleEditTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditingTask({
      title: task.title,
      description: task.description || "",
      status: task.status,
      projectId: task.project?._id || "",
      assignedTo: task.assignedUser?._id || "",
    });
    setShowEditTask(true);
  };

  const handleDeleteTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteTask(true);
  };

  // Filter and search functions
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProject =
      !taskFilter.projectId || task.project?._id === taskFilter.projectId;
    const matchesStatus =
      !taskFilter.status || task.status === taskFilter.status;
    const matchesAssignee =
      !taskFilter.assignedTo ||
      task.assignedUser?._id === taskFilter.assignedTo;

    return matchesSearch && matchesProject && matchesStatus && matchesAssignee;
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter((task) => task.project?._id === projectId);
  };

  const getTaskStatusCounts = (projectId: string) => {
    const projectTasks = getTasksByProject(projectId);
    return {
      todo: projectTasks.filter((task) => task.status === "todo").length,
      inProgress: projectTasks.filter((task) => task.status === "in-progress")
        .length,
      done: projectTasks.filter((task) => task.status === "done").length,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">TeamFlow</h1>
              </div>
              <nav className="hidden md:flex space-x-4">
                <Button
                  variant={activeTab === "overview" ? "default" : "default"}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </Button>
                <Button
                  variant={activeTab === "projects" ? "default" : "default"}
                  onClick={() => setActiveTab("projects")}
                >
                  Projects
                </Button>
                <Button
                  variant={activeTab === "tasks" ? "default" : "default"}
                  onClick={() => setActiveTab("tasks")}
                >
                  Tasks
                </Button>
                <Button
                  variant={activeTab === "messages" ? "default" : "default"}
                  onClick={() => setActiveTab("messages")}
                >
                  Messages
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {user?.role?.toLowerCase()}
                </p>
              </div>
              <Button variant="default" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your team today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                Active projects in your team
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Tasks across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
              <p className="text-xs text-muted-foreground">
                Recent team conversations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content based on active tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Projects</span>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateProject(true)}
                    disabled={
                      !["ADMIN", "MANAGER"].includes(user?.role as string)
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </CardTitle>
                <CardDescription>Your team's active projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewProject(project)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {project.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {project.description || "No description"}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                        <span>
                          {getTasksByProject(project._id).length} tasks
                        </span>
                        <span>
                          Created:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge>{project.team?.name}</Badge>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No projects yet</p>
                    <p className="text-sm">
                      Create your first project to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Tasks</span>
                  <Button size="sm" onClick={() => setShowCreateTask(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </CardTitle>
                <CardDescription>Tasks that need attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task._id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewTask(task)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {task.title}
                      </h4>
                      <Select value={task.status}>
                        <SelectTrigger
                          className={`w-32 ${getStatusColor(task.status)}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {task.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Project: {task.project?.name}</span>
                      <span>
                        Assigned to: {task.assignedUser?.name || "Unassigned"}
                      </span>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks yet</p>
                    <p className="text-sm">Create tasks for your projects</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Team Messages{" "}
                  <Circle
                    className={isConnected ? "text-green-600" : "text-red-600"}
                    size={12}
                    fill={isConnected ? "green" : "red"}
                  />
                </CardTitle>
                <CardDescription>
                  Recent conversations in your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.slice(0, 5).map((message) => (
                    <div
                      key={message._id}
                      className="flex space-x-3 p-3 border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">
                            {message.sender?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {message.sender?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages yet</p>
                      <p className="text-sm">
                        Start a conversation with your team
                      </p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="mt-6 flex space-x-2">
                  <Input
                    placeholder="Type a message to your team..."
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sendingMessage}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                  >
                    {sendingMessage ? "Sending..." : "Send"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "projects" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Projects</span>
                <Button
                  onClick={() => setShowCreateProject(true)}
                  disabled={
                    !["ADMIN", "MANAGER"].includes(user?.role as string)
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </CardTitle>
              <CardDescription>Manage your team's projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => {
                  const statusCounts = getTaskStatusCounts(project._id);
                  return (
                    <Card key={project._id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="truncate">{project.name}</span>
                          <div className="flex space-x-1">
                            <Button
                              variant="default"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProject(project);
                              }}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(project);
                              }}
                              disabled={
                                !["ADMIN", "MANAGER"].includes(
                                  user?.role as string
                                )
                              }
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(project);
                              }}
                              disabled={
                                !["ADMIN"].includes(user?.role as string)
                              }
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description || "No description"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          {/* Task Status Overview */}
                          <div className="flex justify-between text-xs">
                            <div className="text-center">
                              <div className="text-gray-600">To Do</div>
                              <div className="font-semibold">
                                {statusCounts.todo}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-blue-600">In Progress</div>
                              <div className="font-semibold">
                                {statusCounts.inProgress}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-green-600">Done</div>
                              <div className="font-semibold">
                                {statusCounts.done}
                              </div>
                            </div>
                          </div>

                          {/* Project Info */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(
                                  project.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge className="text-xs">
                              {project.team?.name}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {projects.length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <Folder className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No projects</h3>
                    <p className="mb-4">
                      Get started by creating your first project
                    </p>
                    <Button
                      onClick={() => setShowCreateProject(true)}
                      disabled={
                        !["ADMIN", "MANAGER"].includes(user?.role as string)
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "tasks" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Tasks</span>
                <Button onClick={() => setShowCreateTask(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </CardTitle>
              <CardDescription>
                Track and manage tasks across {projects.length} projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tasks..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button variant="default">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    value={taskFilter.projectId}
                    onValueChange={(value) =>
                      setTaskFilter((prev) => ({ ...prev, projectId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>

                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={taskFilter.status}
                    onValueChange={(value) =>
                      setTaskFilter((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={taskFilter.assignedTo}
                    onValueChange={(value) =>
                      setTaskFilter((prev) => ({ ...prev, assignedTo: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Assignees" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamUsers.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewTask(task)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Select value={task.status}>
                          <SelectTrigger
                            className={`w-32 ${getStatusColor(task.status)}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex space-x-1">
                          <Button
                            variant="default"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTaskClick(task);
                            }}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="default"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTaskClick(task);
                            }}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Project: {task.project?.name}</span>
                        <span>
                          Assigned: {task.assignedUser?.name || "Unassigned"}
                        </span>
                      </div>
                      <span>
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CheckSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">
                      {tasks.length === 0
                        ? "No tasks yet"
                        : "No tasks match your filters"}
                    </h3>
                    <p className="mb-4">
                      {tasks.length === 0
                        ? "Create tasks for your projects"
                        : "Try adjusting your search or filters"}
                    </p>
                    <Button onClick={() => setShowCreateTask(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "messages" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Team Messages{" "}
                <Circle
                  className={isConnected ? "text-green-600" : "text-red-600"}
                  size={12}
                  fill={isConnected ? "green" : "red"}
                />
              </CardTitle>
              <CardDescription>
                Communicate with your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {messages.map((message) => (
                  <div key={message._id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {message.sender?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {message.sender?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 bg-white p-3 rounded-lg border">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">
                      No messages yet
                    </h3>
                    <p>Start the conversation with your team</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message here..."
                  className="flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sendingMessage}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {sendingMessage ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Create Project Dialog */}
      <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your team's workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="default"
              onClick={() => setShowCreateProject(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProject.name.trim() || creatingProject}
            >
              {creatingProject ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditProject} onOpenChange={setShowEditProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-project-name">Project Name</Label>
              <Input
                id="edit-project-name"
                placeholder="Enter project name"
                value={editingProject.name}
                onChange={(e) =>
                  setEditingProject((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="edit-project-description">Description</Label>
              <Textarea
                id="edit-project-description"
                placeholder="Enter project description"
                value={editingProject.description}
                onChange={(e) =>
                  setEditingProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="default" onClick={() => setShowEditProject(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditProject}
              disabled={!editingProject.name.trim() || updatingProject}
            >
              {updatingProject ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Project Dialog */}
      <Dialog open={showViewProject} onOpenChange={setShowViewProject}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-14">
              <span>{selectedProject?.name}</span>
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    selectedProject && handleEditClick(selectedProject)
                  }
                  disabled={
                    !["ADMIN", "MANAGER"].includes(user?.role as string)
                  }
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    selectedProject && handleDeleteClick(selectedProject)
                  }
                  disabled={!["ADMIN"].includes(user?.role as string)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedProject?.description || "No description"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Project Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {getTasksByProject(selectedProject?._id || "").length}
                    </div>
                    <div className="text-sm text-gray-500">Total Tasks</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {
                        getTaskStatusCounts(selectedProject?._id || "")
                          .inProgress
                      }
                    </div>
                    <div className="text-sm text-gray-500">In Progress</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {getTaskStatusCounts(selectedProject?._id || "").done}
                    </div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Tasks */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tasks</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getTasksByProject(selectedProject?._id || "")?.map((task) => (
                  <div
                    key={task._id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewTask(task)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {task.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span>{task.assignedUser?.name || "Unassigned"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {getTasksByProject(selectedProject?._id || "")?.length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks in this project</p>
                    <p className="text-sm">Create tasks to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={showDeleteProject} onOpenChange={setShowDeleteProject}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project "{selectedProject?.name}" and all its tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingProject}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={deletingProject}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingProject ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Task Dialog */}
      <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to a project.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-project">Project</Label>
                <Select
                  value={newTask.projectId}
                  onValueChange={(value) =>
                    setNewTask((prev) => ({ ...prev, projectId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="task-status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value: "todo" | "in-progress" | "done") =>
                    setNewTask((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* In the Create Task Dialog - Fix the Assign To section */}
            <div>
              <Label htmlFor="task-assignee">Assign To</Label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) =>
                  setNewTask((prev) => ({ ...prev, assignedTo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Assigners" />
                </SelectTrigger>
                <SelectContent>
                  {teamUsers.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="default" onClick={() => setShowCreateTask(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={
                !newTask.title.trim() ||
                !newTask.projectId ||
                !newTask.assignedTo ||
                creatingTask
              }
            >
              {creatingTask ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={showEditTask} onOpenChange={setShowEditTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-task-title">Task Title</Label>
              <Input
                id="edit-task-title"
                placeholder="Enter task title"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="edit-task-description">Description</Label>
              <Textarea
                id="edit-task-description"
                placeholder="Enter task description"
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-task-project">Project</Label>
                <Select
                  value={editingTask.projectId}
                  onValueChange={(value) =>
                    setEditingTask((prev) => ({ ...prev, projectId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-task-status">Status</Label>
                <Select
                  value={editingTask.status}
                  onValueChange={(value: "todo" | "in-progress" | "done") =>
                    setEditingTask((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* In the Edit Task Dialog - Fix the Assign To section */}
            <div>
              <Label htmlFor="edit-task-assignee">Assign To</Label>
              <Select
                value={editingTask.assignedTo}
                onValueChange={(value) =>
                  setEditingTask((prev) => ({ ...prev, assignedTo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Assingner" />
                </SelectTrigger>
                <SelectContent>
                  {teamUsers.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="default" onClick={() => setShowEditTask(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditTask}
              disabled={
                !editingTask.title.trim() ||
                !editingTask.projectId ||
                updatingTask
              }
            >
              {updatingTask ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Task Dialog */}
      <Dialog open={showViewTask} onOpenChange={setShowViewTask}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-20">
              <span>{selectedTask?.title}</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    selectedTask && handleEditTaskClick(selectedTask)
                  }
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    selectedTask && handleDeleteTaskClick(selectedTask)
                  }
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedTask?.description || "No description"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Task Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-2">
                  Status
                </h4>
                <Badge
                  className={getStatusColor(selectedTask?.status || "todo")}
                >
                  {selectedTask?.status?.replace("-", " ") || "To Do"}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-2">
                  Project
                </h4>
                <p className="text-sm">{selectedTask?.project?.name}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-2">
                  Assigned To
                </h4>
                <p className="text-sm">
                  {selectedTask?.assignedUser?.name || "Unassigned"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-2">
                  Created
                </h4>
                <p className="text-sm">
                  {selectedTask
                    ? new Date(selectedTask.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
            </div>

            {/* Quick Status Update */}
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-3">
                Update Status
              </h4>
              <div className="flex space-x-2">
                {(["todo", "in-progress", "done"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={
                      selectedTask?.status === status ? "default" : "outline"
                    }
                    size="sm"
                  >
                    {status.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
      <AlertDialog open={showDeleteTask} onOpenChange={setShowDeleteTask}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task "{selectedTask?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingTask}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              disabled={deletingTask}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingTask ? "Deleting..." : "Delete Task"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
