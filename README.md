# Multi-Language Translator

A browser-based translator built with HTML, CSS and JavaScript.

## Files
- `index.html` — webpage structure
- `style.css` — layout and responsive styling
- `script.js` — translation, speech recognition and text-to-speech
- `image/` — optional background image folder

## Run on your laptop
1. Extract this ZIP file.
2. Open the extracted `Multi-Language-Translator` folder.
3. Double-click `index.html` to open it in Chrome or Edge.
4. Connect to the internet to use the MyMemory translation API.

## Optional background image
Your original CSS referred to `image/808-440.jpg`. That image was not included in the files shared in the chat.
To use your own background, copy the image into the `image` folder and name it exactly `808-440.jpg`.
The page will still work without it; the CSS has a plain background fallback.

## GitHub Pages
Upload `index.html`, `style.css`, `script.js`, and the `image` folder to the root of a GitHub repository.
Then open Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.

## Notes
- Translation uses the public MyMemory API and requires internet access.
- Microphone speech recognition depends on browser support and microphone permission. Chrome is recommended.
- Available speech voices depend on the voices installed on the user's device.
