import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
    <div className="flex justify-center items-center min-h-screen py-8">
        <UserProfile path="/user-profile" />
    </div>
);
export default UserProfilePage;