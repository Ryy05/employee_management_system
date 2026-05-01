export async function updateEmployeeProfilePicture(employeeId, photoUrl) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ photograph: photoUrl }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile picture: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  }
  