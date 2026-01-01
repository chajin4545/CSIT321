import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import Header from '../../components/common/Header';

const Review = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Review Submitted! Thank you for your feedback.');
    navigate('/student/admin-chat'); 
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Leave a Review" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate('/student/admin-chat')} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-blue-600 transition-colors">
                <ArrowLeft size={20} /> Back to Chat
            </button>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Leave a Review</h2>
                <p className="text-slate-600 mb-6">How was your experience with this chat session?</p>
                
                <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 hover:scale-110 transition-transform focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-slate-300'}`}
                        >
                        <Star size={32} className={star <= rating ? 'fill-current' : ''} />
                        </button>
                    ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Remarks</label>
                    <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32"
                    placeholder="Tell us more about your experience..."
                    ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                    type="button"
                    onClick={() => navigate('/student/admin-chat')}
                    className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                    Submit Review
                    </button>
                </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Review;
