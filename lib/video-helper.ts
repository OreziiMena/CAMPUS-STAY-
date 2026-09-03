/**
 * Extracts a crystal-clear JPEG poster frame from a video file in the browser using HTML5 Canvas.
 * This ensures every video listing has a visible, high-resolution thumbnail across all devices and browsers.
 */
export function extractVideoThumbnail(file: File): Promise<File | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !file.type.startsWith("video/")) {
      resolve(null);
      return;
    }

    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      const url = URL.createObjectURL(file);
      video.src = url;

      let timeout = setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve(null);
      }, 5000);

      video.onloadedmetadata = () => {
        // Seek to 0.5s or midpoint for good thumbnail
        video.currentTime = Math.min(0.5, video.duration > 0 ? video.duration / 4 : 0.5);
      };

      video.onseeked = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                URL.revokeObjectURL(url);
                if (blob) {
                  const posterFile = new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, "") + "-poster.jpg",
                    { type: "image/jpeg" }
                  );
                  resolve(posterFile);
                } else {
                  resolve(null);
                }
              },
              "image/jpeg",
              0.85
            );
          } else {
            URL.revokeObjectURL(url);
            resolve(null);
          }
        } catch {
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };

      video.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}
