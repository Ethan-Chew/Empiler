export default async function handleFileUpload(caseID) {
    return new Promise((resolve, reject) => {
        // Create an input element to dynamically upload files
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = '.jpg, .jpeg, .png'; // Restrict to jpg, jpeg, and png files

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
                if (!validImageTypes.includes(file.type)) {
                    alert('Please select a valid image file (JPG, JPEG, PNG).');
                    return reject(new Error('Invalid file type selected.'));
                }

                try {
                    // Prepare FormData for the API request
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('caseId', caseID); // Ensure `caseID` is defined in the scope

                    // Make an API Call to upload the file
                    const response = await fetch("http://localhost:8080/api/chat/upload", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("Failed to upload file.");
                    }

                    const data = await response.json();

                    // Resolve the Promise with the file URL
                    resolve(data.filePath);
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            }
        };

        // Trigger the file input to open the file selection dialog
        fileInput.click();
    });
}