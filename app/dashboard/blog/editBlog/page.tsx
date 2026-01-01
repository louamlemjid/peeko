'use client';

import { useState, useEffect, useCallback } from "react"; // Add useCallback
import { Edit3, Trash2, Calendar, Eye, ChevronDown, ChevronUp, Plus, Search, Filter, Pen} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IBlog } from "@/model/blogModel";
import { toast } from 'react-toastify';
import Image from "next/image"; // Import Image from next/image
import { UploadButton } from "@/utils/uploadthing";

export default function EditBlogPage() {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<IBlog[]>([]);
    const [expandedBlog, setExpandedBlog] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState<{ blogId: string; contentIndex: number } | null>(null);
    const [editingBlog, setEditingBlog] = useState<{ blog: IBlog } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<'views' | 'date' | 'title'>('date');
    const [isLoading, setIsLoading] = useState(true);

   const filterAndSortBlogs = useCallback(() => {
    const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort blogs
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'views':
                return b.views - a.views;
            case 'date':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    setFilteredBlogs(filtered);
    console.log('Filtered and sorted blogs:', filtered);
}, [blogs, searchTerm, sortBy]);

    useEffect(() => {
        loadBlogs();
    }, []);

    useEffect(() => {
        filterAndSortBlogs();
    }, [filterAndSortBlogs]); // Added filterAndSortBlogs to the dependency array
const loadBlogs = async () => {
    try {
        setIsLoading(true);
        const response = await fetch('/api/v1/blog', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }
        const blogData = await response.json();
        console.log('Blogs loaded:', blogData.blogs);
        if (blogData) {
            setBlogs(blogData.blogs);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error loading blogs:', error.message);
        } else {
            console.error('Unknown error loading blogs:', error);
        }
        toast.error('Failed to load blog posts. Please try again.');
    } finally {
        setIsLoading(false);
    }
};


    const handleDelete = async (blogId: string) => {
        if (window.confirm('Etes vous sûr de vouloir supprimer ce blog ?')) {
            const loadingToastId = toast.loading("Suppression du blog en cours...");

            try {
                console.log('Deleting blog:', blogId);

                const deleteResponse = await fetch(`/api/v1/blog/${blogId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                if (!deleteResponse.ok) {
                    toast.update(loadingToastId, {
                        render: "Impossible de supprimer le blog",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                }
                const deleteData = await deleteResponse.json();
                console.log('Blog deleted:', deleteData);
                loadBlogs(); // Reload blogs after deletion


                toast.update(loadingToastId, {
                    render: "Blog post deleted successfully! 🗑️",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            } catch  { // Add type annotation for error
                toast.update(loadingToastId, {
                    render: "Failed to delete blog post",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        }
    };

    const handleEdit = (blog: IBlog) => {
        setEditingBlog({ blog: { ...blog } });
    };

    const handleSaveEdit = async() => {
        if (editingBlog) {
            const loadingToastId = toast.loading("Modification du blog en cours...");

            try {
                console.log('Updating blog:', editingBlog.blog);
                // Removed unused _id and obj variables
                const {...blogUpdate } = editingBlog.blog;
                const updateResponse = await fetch(`/api/v1/blog/${editingBlog.blog._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(blogUpdate)
                });
                if (!updateResponse.ok) {
                    toast.update(loadingToastId, {
                        render: "Impossible de modifier le blog",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                }
                const updateData = await updateResponse.json();
                console.log('Blog updated:', updateData);
                loadBlogs(); // Reload blogs after update

                setEditingBlog(null);

                toast.update(loadingToastId, {
                    render: "Blog post updated successfully! ✅",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            } catch  { // Add type annotation for error
                toast.update(loadingToastId, {
                    render: "Failed to update blog post",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingBlog(null);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, contentIndex?: number) => {
        if (!editingBlog) return;

        const { name, value } = e.target;

        if (name.startsWith("content-") && typeof contentIndex === "number") {
            const key = name.split("-")[1] as "subTitle" | "text";
            const updatedContent = [...editingBlog.blog.content];
            updatedContent[contentIndex][key] = value;
            setEditingBlog({
                ...editingBlog,
                blog: {
                    ...editingBlog.blog,
                    content: updatedContent,
                    updatedAt: new Date()
                }
            });
        } else if (name === 'title' || name === 'description') {
            const updatedBlog = {
                ...editingBlog.blog,
                [name]: value,
                updatedAt: new Date()
            };

            

            setEditingBlog({
                ...editingBlog,
                blog: updatedBlog
            });
        } else {
            setEditingBlog({
                ...editingBlog,
                blog: {
                    ...editingBlog.blog,
                    [name]: name === 'views' ? parseInt(value) || 0 : value,
                    updatedAt: new Date()
                }
            });
        }
    };

    const handleInlineContentEdit = (blogId: string, contentIndex: number, field: 'subTitle' | 'text', value: string) => {
        const updatedBlogs = blogs.map(blog => {
            if (blog._id === blogId) {
                const updatedContent = [...blog.content];
                updatedContent[contentIndex][field] = value;
                return {
                    ...blog,
                    content: updatedContent,
                    updatedAt: new Date()
                };
            }
            return blog;
        });
        setBlogs(updatedBlogs);
    };

    const handleSaveInlineEdit = async (blogId: string) => {
        const blogToUpdate = blogs.find(blog => blog._id === blogId);
        if (!blogToUpdate) return;

        const loadingToastId = toast.loading("Sauvegarde des modifications...");

        try {
            // Removed unused _id variable
            const {  ...blogUpdate } = blogToUpdate;
            const updateResponse = await fetch(`/api/v1/blog/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogUpdate)
            });

            if (!updateResponse.ok) {
                toast.update(loadingToastId, {
                    render: "Impossible de sauvegarder les modifications",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
                return;
            }

            await loadBlogs(); // Reload blogs after update
            setEditingContent(null);

            toast.update(loadingToastId, {
                render: "Modifications sauvegardées avec succès! ✅",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch { // Add type annotation for error
            toast.update(loadingToastId, {
                render: "Erreur lors de la sauvegarde",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    const handleAddContent = (blogId: string) => {
        const updatedBlogs = blogs.map(blog => {
            if (blog._id === blogId) {
                return {
                    ...blog,
                    content: [...blog.content, { subTitle: "", text: "" }],
                    updatedAt: new Date()
                };
            }
            return blog;
        });
        setBlogs(updatedBlogs);
    };

    const handleDeleteContent = (blogId: string, contentIndex: number) => {
        if (window.confirm('Are you sure you want to delete this content section?')) {
            const updatedBlogs = blogs.map(blog => {
                if (blog._id === blogId) {
                    const updatedContent = blog.content.filter((_, index) => index !== contentIndex);
                    return {
                        ...blog,
                        content: updatedContent.length > 0 ? updatedContent : [{ subTitle: "", text: "" }],
                        updatedAt: new Date()
                    };
                }
                return blog;
            });
            setBlogs(updatedBlogs);
            setEditingContent(null);
        }
    };

    const toggleExpanded = (blogId: string) => {
        setExpandedBlog(expandedBlog === blogId ? null : blogId);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading blog posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gerer les articles</h1>
                            <p className="text-gray-600">Modifier ou Supprimer ({filteredBlogs.length} articles)</p>
                        </div>
                        <Link href="/dashboard/blog/createBlog">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                <Plus size={20} />
                                Creer un nouvel article
                            </motion.button>
                        </Link>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200/60 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search blog posts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'views' | 'date' | 'title')}
                                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 bg-white"
                                >
                                    <option value="views">Nombre de Vues</option>
                                    <option value="date">Date</option>
                                    <option value="title">Titre</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Blog List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="space-y-6"
                >
                    {filteredBlogs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200/60">
                            <div className="text-gray-300 text-6xl mb-6">📝</div>
                            <h3 className="text-lg font-medium text-gray-500 mb-2">
                                {searchTerm ? 'No blog posts found' : 'No blog posts yet'}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">
                                {searchTerm ? 'Try adjusting your search terms' : 'Create your first blog post to get started'}
                            </p>
                            {!searchTerm && (
                                <Link href="/dashboard/blog/createBlog"> {/* Corrected Link href */}
                                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium">
                                        Creer un article
                                    </button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        filteredBlogs.map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-white rounded-xl shadow-lg border border-gray-200/60 overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                {/* Blog Header */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 mr-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed">{blog.description}</p>
                                                    {blog && (
                                                        <div className="mt-2 text-sm text-gray-500">
                                                            <span className="font-medium">Titre SEO:</span> {blog.title}
                                                        </div>
                                                    )}
                                                </div>
                                                {blog.imageUrl && (
                                                    <div className="flex-shrink-0">
                                                        <Image
                                                            src={blog.imageUrl }
                                                            alt={blog.title}
                                                            width={80} // Specify width
                                                            height={80} // Specify height
                                                            className="object-cover rounded-xl border border-gray-200 shadow-sm"
                                                            
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                                <span className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    {formatDate(blog.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Eye size={16} />
                                                    {blog.views.toLocaleString()} vues
                                                </span>
                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                                    {blog.content.length} sections
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleEdit(blog)}
                                                className="flex items-center gap-2 px-2 py-2 text-blue-500 rounded-lg text-sm hover:bg-blue-100 transition-all duration-200 hover:shadow-lg hover:cursor-pointer"
                                            >
                                                <Edit3 size={20} />

                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(blog._id)}
                                                className="flex items-center gap-2 px-2 py-2 text-red-500 rounded-lg text-sm hover:bg-red-100 transition-all duration-200 hover:shadow-lg hover:cursor-pointer"
                                            >
                                                <Trash2 size={20} />

                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleExpanded(blog._id)}
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-all duration-200"
                                            >
                                                {expandedBlog === blog._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}

                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {expandedBlog === blog._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h4 className="text-lg font-semibold text-gray-900">Contenu des sections</h4>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-sm text-gray-500">
                                                            Dernière Mise à Jour: {formatDate(blog.updatedAt)}
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleAddContent(blog._id)}
                                                            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg text-sm hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                                        >
                                                            <Plus size={14} />
                                                            Ajouter Section
                                                        </motion.button>
                                                    </div>
                                                </div>
                                                <div className="grid gap-4">
                                                    {blog.content.map((section, sectionIndex) => (
                                                        <motion.div
                                                            key={sectionIndex}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                                                            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                                        >
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex-1">
                                                                    {editingContent?.blogId === blog._id && editingContent?.contentIndex === sectionIndex ? (
                                                                        <div className="space-y-3">
                                                                            <input
                                                                                type="text"
                                                                                value={section.subTitle}
                                                                                onChange={(e) => handleInlineContentEdit(blog._id, sectionIndex, 'subTitle', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-lg font-semibold"
                                                                                placeholder="Section title"
                                                                            />
                                                                            <textarea
                                                                                value={section.text}
                                                                                onChange={(e) => handleInlineContentEdit(blog._id, sectionIndex, 'text', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none resize-none"
                                                                                rows={4}
                                                                                placeholder="Section content"
                                                                            />
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    onClick={() => handleSaveInlineEdit(blog._id)}
                                                                                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                                                                                >
                                                                                    Save
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setEditingContent(null)}
                                                                                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <h5 className="font-semibold text-gray-800 text-lg mb-2">
                                                                                {section.subTitle || `Section ${sectionIndex + 1}`}
                                                                            </h5>
                                                                            <p className="text-gray-600 leading-relaxed">
                                                                                {section.text}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 ml-4">
                                                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                                                        Section {sectionIndex + 1}
                                                                    </span>
                                                                    {/* Edit and Delete Content Buttons */}
                                                                    {editingContent?.blogId === blog._id && editingContent?.contentIndex === sectionIndex ? null : (
                                                                        <>
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                onClick={() => setEditingContent({ blogId: blog._id, contentIndex: sectionIndex })}
                                                                                className="p-1 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                                                                                title="Edit section"
                                                                            >
                                                                                <Pen size={16} />
                                                                            </motion.button>
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                onClick={() => handleDeleteContent(blog._id, sectionIndex)}
                                                                                className="p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                                                                title="Delete section"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </motion.button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Edit Blog Modal */}
                <AnimatePresence>
                    {editingBlog && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            onClick={handleCancelEdit} // Close modal when clicking outside
                        >
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Modifier l&apos;article</h2>
                                <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-6">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            value={editingBlog.blog.title}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            value={editingBlog.blog.description}
                                            onChange={handleEditChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                              // Do something with the response
                                              console.log("Files: ", res);
                                              setEditingBlog({ ...editingBlog,
                                                    blog: {
                                                        ...editingBlog.blog,
                                                        imageUrl:res[0].ufsUrl}} );

                                              toast.success("Image téléchargée avec succes !")
                                            }}
                                            onUploadError={(error: Error) => {
                                              // Do something with the error.
                                              toast.error(`ERROR! ${error.message}`);
                                            }}
                                        />
                                        
                                        {editingBlog.blog.imageUrl && (
                                            <div className="mt-4">
                                                <Image
                                                    src={editingBlog.blog.imageUrl}
                                                    alt="Preview"
                                                    width={200}
                                                    height={150}
                                                    className="object-cover rounded-lg shadow-md"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    


                                    <div className="flex justify-end gap-3 mt-8">
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                        >
                                            Sauvegarder les modifications
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}