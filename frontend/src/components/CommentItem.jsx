import React from 'react';
import { removeComment, clearStatusCom } from "../redux/features/comment/commentSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import Moment from "react-moment";

export const CommentItem = ({ cmt }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const removeCommentHandler = () => {
        try {
            dispatch(removeComment(cmt.id)).then(() => {
                dispatch(clearStatusCom());
            });
        } catch (e) {
            console.log(e);
            toast.error('Ошибка при удалении комментария');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">
                        {cmt.User.username}
                    </span>
                    <span className="text-sm text-slate-500">
                        <Moment date={cmt.date_of_add} format="D MMM YYYY" />
                    </span>
                </div>

                {user?.id === cmt.commentator || user?.role === "admin" && (
                    <button
                        onClick={removeCommentHandler}
                        className="text-slate-400 hover:text-red-500 transition-colors duration-200"
                        title="Удалить комментарий"
                    >
                        <AiFillDelete className="text-lg" />
                    </button>
                )}
            </div>

            <div className="prose prose-slate max-w-none text-sm text-slate-600">
                <ReactMarkdown>{cmt.comment}</ReactMarkdown>
            </div>
        </div>
    );
};
