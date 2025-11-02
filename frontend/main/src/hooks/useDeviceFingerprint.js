import { useState, useEffect } from "react";

export const useDeviceFingerprint = () => {
    const [fingerprint, setFingerprint] = useState();
    const [isFingerprinting, setIsFingerprinting] = useState();

    useEffect(() => {
        const generateFingerprint = async () => {
            try {
                const components = {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    platform: navigator.platform,
                    hardwareConcurrency: navigator.hardwareConcurrency,
                    deviceMemory: navigator.deviceMemory,
                    screenResolutions: `${screen.width}x${screen.height}`,
                    colorDepth: screen.colorDepth,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    touchSupport: 'ontouchstart' in window,
                };

                // generate canvas fingerprint 
                const canvasFingerprint = await generateCanvasFingerprint();
                components.canvas = canvasFingerprint;

                const webglFingerprint = await generateWebGLFingerprint();
                components.webgl = webglFingerprint;

                const audioFingerprint = await generateAudioFingerprint();
                components.audio = audioFingerprint;

                // create hash
                const fingerprintString = JSON.stringify(components);
                const hash = await generateHash(fingerprintString);

                setFingerprint({
                    hash,
                    components,
                    timestamp: new Date.toString()
                });

            } catch (error) {
                console.error('Fingerprint genaration failed');
                setFingerprint({error: 'Fingerprint failed'});

            } finally {
                setIsFingerprinting(false);
            }
        };

        generateFingerprint();
    }, []);

    return { fingerprint, isFingerprinting};
}

const generateCanvasFingerprint = () => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 200;
        canvas.height = 50;

        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('One Taliban Security', 2 , 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('One Taliban Security', 4, 17);

        const dataURL = canvas.toDataURL();
        resolve(dataURL);
    });
};

const generateWebGLFingerprint = () => {
    return new Promise((resolve) => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experiemental-webgl');

            if (!gl) {
                resolve('Webgl_not_supported');
                return;
            }

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const vendor = gl.getParameter(debugInfo ? debugInfo.UNMASKED_VENDOR_WEBGL : gl.VENDOR);
            const renderer = gl.getParameter(debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : gl.RENDERER);

            resolve(`${vendor}-${renderer}`);
        } catch (error) {
            resolve('webgl_error');
        }
    });
};

const generateAudioFingerprint = () => {
    return new Promise((resolve) => {
        try {
            // second seems to be not available
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();

            oscillator.connect(analyser);
            analyser.connect(audioContext.destination);

            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                resolve('audio_fingerprint_generated');
            }, 100);
        } catch (error) {
            resolve('audio_not_supported');
        }
    });
};

const generateHash = async (str) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
};