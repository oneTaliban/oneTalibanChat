import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Eye, MessageCircle, Clock, Zap } from 'lucide-react'


const BlogPostCard = ({ post, index}) => {

  return (
    <motion.article
        initial={{ opacity: 0, y:20}}
        animate={{ opacity: 1, y:0}}
        exit={{ opacity: 0, y: -20}}
        transition={{ delay: index * 0.1}}
        whileHover={{ y: -7}}
        className='bg-terminal-bg border border-gray-800 rounded-lg overflow-hidden hover:border-hacker-green/50 transition-all duration-75 relative group'
    >
        {/* featured Badge */}
        {post.is_featured && (
            <div className="relative">
                <div className="absolute top-4 right-4 z-10">
                    <div className="bg-hacker-green text-black px-2 py-1 rounded text-xs font-mono font-bold flex items-center space-x-1">
                        <Zap size={12}></Zap>
                        <span>FEATURED</span>
                    </div>
                </div>
            </div>
        )}

        {/* post image */}
        <div className="h-48 bg-gradient-to-br from-hacker-green/20 to-hacker-blue/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
        </div>

        {/* Post content */}
        <div className="p-6">
            {/* category */}
            <div className="flex items-center justify-between mb-3">
                <span
                    className='text-xs font-mono px-2 py-1 rounded border'
                    style={{ 
                        color: post.category.color,
                        borderColor: post.category.color,
                        backgroundColor: `${post.category.color}20`
                    }}
                >
                    {post.category.name}
                </span>

                <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                        <Eye size={12}></Eye>
                        <span>{post.view_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <MessageCircle size={12}></MessageCircle>
                        <span>24</span>
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3 className="font-mono font-bold text-white mb-2 group-hover:text-hacker-green transition-colors line-clamp-2">
                <Link
                    to={`/blog/posts/${post.id}`}
                >
                    {post.title}
                </Link>
            </h3>

            {/* Excerpt */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {post.excerpt}
            </p>

            {/* Meta information */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                    <span className="font-mono">@{post.author.username}</span>
                </div>

                <div className="flex items-center space-x-1">
                    <Clock size={12}></Clock>
                    <span>{post.read_time} min read</span>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-4">
                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                        key={tagIndex}
                        className='text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded'
                    >
                        #{tag.name}
                    </span>
                ))}
                {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500 font-mono">
                        +{post.tags.length - 3}
                    </span>
                )}
            </div>

            {/* Read More */}
            <div className="mt-4 pt-4 border-t border-gray-800">
                <Link
                    to={`/blog/posts/${post.id}`}
                    className='text-hacker-blue hover:text-hacker-green font-mono text-sm transition-colors flex items-center space-x-1'
                >
                    <span>Read More</span>
                    <Zap size={14}></Zap>
                </Link>
            </div>
        </div>
    </motion.article>
  );
};

export default BlogPostCard;