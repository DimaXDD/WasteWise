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
                dispatch(clearStatusCom()); // Сброс состояния после удаления комментария
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className={'flex flex-col break-all gap-3 mt-2 bg-green-100'}>
            <div className={'flex flex-wrap'}>
                <div className={'flex text-xl text-lime-900 ml-3 opacity-50'}>{cmt.User.username}</div>

                {user?.id === cmt.commentator || user?.role === "admin" ? (
                    <button
                        onClick={removeCommentHandler}
                        className={'flex flex-wrap justify-center gap-2 ml-5 mt-1.5 text-xl text-lime-900 opacity-50'}>
                        <AiFillDelete />
                    </button>
                ) : null}
                <div className={'flex text-xl text-lime-900 opacity-50 justify-end items-end'}>
                    <Moment date={cmt.date_of_add} format={' D MMM YYYY'} />
                </div>
            </div>
            <div className={'flex flex-col text-lime-900 ml-2 mb-1 text-2xl font-bold'}>
                <ReactMarkdown children={cmt.comment} />
            </div>
        </div>
    );
};
