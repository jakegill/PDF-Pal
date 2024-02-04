import { getServerSession } from "next-auth";
import { authOptions} from "@/config/auth.config";

export default async function Profile() {
    const session = await getServerSession(authOptions);
    const user = session?.user.id
	return (<div>{user}</div>);
}
