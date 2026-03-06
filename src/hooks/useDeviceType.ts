import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'desktop';

export function useDeviceType() {
    const [deviceType, setDeviceType] = useState<DeviceType>(
        window.innerWidth < 1024 ? 'mobile' : 'desktop'
    );

    useEffect(() => {
        const handleResize = () => {
            setDeviceType(window.innerWidth < 1024 ? 'mobile' : 'desktop');
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = deviceType === 'mobile';
    const isDesktop = deviceType === 'desktop';

    return { deviceType, isMobile, isDesktop };
}
