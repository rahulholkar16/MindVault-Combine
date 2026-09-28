import { useState } from "react";
import { useAuth } from "../../store/auth/useAuth";
import { useFeature } from "../../store/feature/useFeature";
import ErrorOverlay from "../ErrorCard/ErrorOverlay/ErrorOverlay";

const ProfileEdit = () => {
    const UserEmail = useAuth((s) => s.user?.email);
    const UserName = useAuth((s) => s.user?.name);
    const [name, setName] = useState(UserName);
    const [email, setEmail] = useState(UserEmail);
    const changeName = useFeature(s => s.changeName);
    const changeEmail = useFeature(s => s.changeEmail);

    const handleSave = async() => {
        if (name === UserName && email === UserEmail) return;
        if (name === UserName) {
            if (email) await changeEmail(email);
            return;
        }
        if (email === UserEmail) {
            if(name) await changeName(name);
            return;
        }

        if ( email && name) {
            await changeName(name);
            await changeEmail(email);
        }
    };

    return (
        <div className="p-4 text-white">
            <ErrorOverlay />
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            <div className="flex flex-col gap-4 max-w-md">
                <div className="flex flex-col gap-1">
                    <label className="text-sm">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 w-full rounded bg-gray-800 border border-gray-600 outline-none"
                        placeholder="Enter your name"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 rounded bg-gray-800 border border-gray-600 outline-none"
                        placeholder="Enter your email"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 p-2 rounded"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ProfileEdit;
