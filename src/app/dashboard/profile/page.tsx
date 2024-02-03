import { getServerSession } from "next-auth";
import { authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function Profile() {
    const session = await getServerSession(authOptions);
    const user = session?.user.id
	return (<div>{user}</div>);
}
