import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "@/redux/slice/user";

const SessionManager = () => {
  const { data: userData, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "authenticated" && userData) {
      dispatch(
        setCredentials({
          token: userData.user.token,
          refreshToken: userData.user.refreshToken,
          user: {
            id: Number(userData.user.id),
            email: userData.user.email,
            name: userData.user.name,
            isEnable: userData.user.isEnable,
            termsAndCondition: userData.user.termsAndCondition,
            profileImg: userData.user.profileImg,
            fileName: userData.user.fileName,
            fileType: userData.user.fileType,
            notificationSetting: userData.user.notificationSetting,
            role: userData.user.role,
            createdAt: userData.user.createdAt,
            updatedAt: userData.user.updatedAt,
          },
        })
      );
    } else if (status === "unauthenticated") {
      dispatch(logout());
    }
  }, [userData, status, dispatch]);

  return null;
};

export default SessionManager;
