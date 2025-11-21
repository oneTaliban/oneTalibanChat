import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Eye, Filter, MessageCircle, Clock, TrendingUp } from 'lucide-react'
import Terminal from '../Ui/Terminal'
import BlogPostCard from './BlogPostCard'
import BlogStats from './BlogStats'


const BlogDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    const categories = [
        {id: 'all', name: 'All Posts', color: 'hacker-green'},
        {id: 'ethical-hacking', name: 'Ethical Hacking', color: 'hacker-red'},
        {id: 'django', name: 'Django-REST-Framework', color: 'hacker-blue'},
        {id: 'react', name: 'React-Guide', color: 'hacker-green'},
        {id: 'cybersecurity', name: 'Cybersecurity', color: 'hacker-red'},
        {id: 'web-development', name: 'Web Development', color: 'hacker-blue'},
    ];

    //mock data to replace with api call
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            // api  simulation
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockPosts = [
                {
                    id: 1,
                    title: 'Advanced Django REST Framework Security', 
                    excerpt: 'Learn how to secure your Django REST API  with JWT, CORS, and rate limiting.',
                    author: {username: 'cyberadmin'},
                    category: { name: 'Django REST Framework', color: '#00bfff'},
                    tags:[{name: 'Django'}, {name: 'security'}, ],
                    view_count: 1245,
                    read_time: 8,
                    created_at: '2024-01-15T10:00:00Z',
                    is_featured: true,
                },
                {
                    id: 2,
                    title: 'Ethical Hacking: Penetration Testing Guide', 
                    excerpt: 'Complete guide to penetration testing methodologies and tools for beginners.',
                    author: {username: 'securityexpert'},
                    category: { name: 'Ethical Hacking', color: '#ff0000'},
                    tags:[{name: 'Hacking'}, {name: 'security'}, ],
                    view_count: 2890,
                    read_time: 12,
                    created_at: '2024-01-12T14:30:00Z',
                    is_featured: true,
                },
                {
                    id: 3,
                    title: 'React Three.js: 3D Web Applications', 
                    excerpt: 'Building immersive 3D  experiences with React and Three.js integration.',
                    author: {username: 'frontendmaster'},
                    category: { name: 'React Guide', color: '#00ff00'},
                    tags:[{name: 'React'}, {name: 'Three.js'}, ],
                    view_count: 856,
                    read_time: 6,
                    created_at: '2024-01-10T09:15:00Z',
                    is_featured: false,
                },                                
            ];

            setPosts(mockPosts);
            setIsLoading(false);
        }
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || 
                                    post.category.name.toLowerCase().includes(selectedCategory.toLowerCase())

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Blog stats */}
            {/* <BlogStats></BlogStats> */}

            {/* search and filter */}
            <Terminal title='Blog Posts' icon={TrendingUp}>
                <div className="space-y-4">
                    {/* Search bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-hacker-green' size={20}></Search>
                            <input
                                type='text'
                                placeholder='Search posts...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full bg-black/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white font-mono focus:border-hacker-green focus:outline-none' 
                            ></input>
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className='bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white font-mono focus:border-hacker-green focus:outline-none'
                            >
                                {categories.map(category => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <button className='bg-hacker-green text-black font-mono font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors flex items-center space-x-2'>
                                <Filter size={18}></Filter>
                                <span>Filter</span>
                            </button>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                                    selectedCategory === category.id
                                        ? `bg-${category.color} text-color`       
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </Terminal>

            {/* post grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div  key={item} className="bg-terminal-bg border border-gray-800 rounded-lg p-6 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded mb-4"></div>
                            <div className="h-3 bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    layout
                >
                    <AnimatePresence>
                        {filteredPosts.map((post, index) => (
                            <BlogPostCard key={post.id} post={post} index={index}></BlogPostCard>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Empty state */}
            {!isLoading && filteredPosts.length === 0 && (
                <Terminal title='No Posts Found'>
                    <div className="text-center py-8">
                        <Search size={48} className='text-gray-400 mx-auto mb-44'></Search>
                        <h3 className="text-lg text-gray-400 font-mono mb-2">No Posts Found</h3>
                        <p className="text-gray-500 font-mono">
                            Try adjusting your search terms or filters
                        </p>
                    </div>
                </Terminal>
            )}
        </div>
  );
};

export default BlogDashboard