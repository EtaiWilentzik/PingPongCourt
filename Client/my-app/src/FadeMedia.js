import React, { useEffect, useState } from "react";
import "./FadeMedia.css";

const FadeMedia = () => {
  const [stage, setStage] = useState("image"); // 'image', 'transition', or 'video'

  useEffect(() => {
    const imageTimer = setTimeout(() => {
      setStage("transition"); // Start fading out the image after 5 seconds
    }, 1500);

    const videoTimer = setTimeout(() => {
      setStage("video"); // Show video after image has faded out
    }, 2500); // 5 seconds wait + 3 seconds fade out

    return () => {
      clearTimeout(imageTimer);
      clearTimeout(videoTimer);
    };
  }, []);

  return (
    <div className="container">
      {(stage === "image" || stage === "transition") && (
        <img src="/logo.jpg" alt="Logo" className={`image-fade ${stage === "transition" ? "fade-out" : ""}`} />
      )}
      {stage === "video" && <video src="/video.mp4" muted autoPlay loop className="video-fade" />}

      {/*<svg*/}
      {/*    fill="#FFFFFF"*/}
      {/*    version="1.1"*/}
      {/*    xmlns="http://www.w3.org/2000/svg"*/}
      {/*    xmlnsXlink="http://www.w3.org/1999/xlink"*/}
      {/*    viewBox="0 0 460 460"*/}
      {/*    xmlSpace="preserve"*/}
      {/*    width="460"*/}
      {/*    height="460"*/}
      {/*>*/}
      {/*  <g id="xmlid_13_">*/}
      {/*    <circle id="xmlid_15_" cx="150.792" cy="41.143" r="41.139" className="svg-elem-1"/>*/}
      {/*    <circle id="xmlid_460_" cx="389.484" cy="176.378" r="16.407" className="svg-elem-2"/>*/}
      {/*    <path*/}
      {/*        id="xmlid_462_"*/}
      {/*        d="M291.219,189.942l10.028,3.625c2.769,1.001,5.826-0.432,6.827-3.201l1.739-4.812l5.926-0.729*/}
      {/*  c9.754-1.199,16.688-10.077,15.489-19.83c-0.726-5.908-4.282-10.767-9.131-13.425l2.208-6.107c1.788-4.946,6.059-8.579,11.226-9.56*/}
      {/*  c14.696-2.79,28.274-14.41,34.374-31.287c8.659-23.954-1.022-49.409-21.622-56.855c-20.6-7.446-44.319,5.936-52.978,29.889*/}
      {/*  c-6.101,16.878-3.091,34.494,6.425,46.035c3.341,4.052,4.304,9.589,2.518,14.529l-4.604,12.738l-53.925,6.628l-43.157-48.542*/}
      {/*  c-3.482-3.917-8.443-5.975-13.384-5.952L96.487,91.538c-5.495-1.655-11.688-0.629-16.453,3.292l-48.018,39.518*/}
      {/*  c-4.522,3.722-6.924,9.432-6.42,15.268l8.531,98.863c0.844,9.78,9.452,17.041,19.257,16.197c9.79-0.845,17.042-9.466,16.197-19.257*/}
      {/*  l-7.726-89.541l24.144-19.87L68.402,277.246l1.026,0.128L56.83,349.46L6.1,422.775c-7.455,10.775-4.765,25.552,6.009,33.008*/}
      {/*  c10.776,7.456,25.553,4.763,33.008-6.009l53.694-77.599c1.953-2.823,3.27-6.034,3.861-9.415l13.896-79.513l19.129,2.383*/}
      {/*  l35.698,60.315l-10.999,87.367C158.617,447.439,169.615,460,183.964,460c11.781,0,21.998-8.769,23.508-20.763l12.013-95.424*/}
      {/*  c0.658-5.223-0.441-10.516-3.122-15.047l-40.006-67.593l13.992-112.316l34.978,39.342c3.398,3.822,8.249,5.971,13.296,5.971*/}
      {/*  c0.721,0,1.447-0.044,2.172-0.133l47.989-5.899C289.385,188.935,290.211,189.577,291.219,189.942z"*/}
      {/*        className="svg-elem-3"*/}
      {/*    />*/}
      {/*    <rect id="xmlid_468_" x="249.074" y="246.216" width="209.043" height="31.989" className="svg-elem-4"/>*/}
      {/*  </g>*/}
      {/*</svg>*/}
    </div>
  );
};

export default FadeMedia;
