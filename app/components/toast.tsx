import React from 'react'

export type ToastType = 'success' | 'danger' | 'warning';

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose?: () => void;
}

const icons = {
    success: (
        <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-green-600 bg-green-200 rounded-lg">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" /></svg>
            <span className="sr-only">Check icon</span>
        </div>
    ),
    danger: (
        <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-red-600 bg-red-200 rounded-lg">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" /></svg>
            <span className="sr-only">Error icon</span>
        </div>
    ),
    warning: (
        <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-yellow-600 bg-yellow-200 rounded-lg">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            <span className="sr-only">Warning icon</span>
        </div>
    )
};

const typeStyles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
    return (
        <div id={`toast-${type}`} className={`flex items-center w-full max-w-sm p-4 rounded-lg shadow border ${typeStyles[type]}`} role="alert">
            {icons[type]}
            <div className="ms-3 text-sm font-medium">{message}</div>
            <button type="button" onClick={onClose} className={`ms-auto flex items-center justify-center bg-transparent box-border hover:bg-black/5 focus:ring-4 focus:ring-black/10 font-medium leading-5 rounded-lg text-sm h-8 w-8 focus:outline-none ${typeStyles[type].split(' ')[1]}`} aria-label="Close">
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" /></svg>
            </button>
        </div>
    )
}
