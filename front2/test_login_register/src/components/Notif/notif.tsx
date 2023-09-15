import React from 'react';

interface NotificationBadgeProps {
    showBadge: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ showBadge }) => {
    return showBadge ? (
        <div className='notification-badge'>
            <span className='notification-count'>1</span>
        </div>
    ) : null;
};

export default NotificationBadge;
