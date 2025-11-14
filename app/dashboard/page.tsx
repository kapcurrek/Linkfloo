import DashboardHeader from "./dashboard-header";
import DashboardButtonItem from "./dashboard-button-item";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {

    return (
        <div className=" text-white min-h-screen absolute inset-0 z-0 " style={{
        background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #291002 100%)",
        }}>

            <div className=" mx-auto">

                <DashboardHeader />

                <main className="grid grid-cols-2 gap-4 mb-8 m pr-10 pl-10 max-w-[1200px]">

                    <DashboardButtonItem name="Moje linki" addr="/dashboard/links"/>
                    <DashboardButtonItem name="Personalizuj stronę" addr="/dashboard/personalizuj"/>
                    <DashboardButtonItem name="Analityka" addr="/dashboard/analityka"/>
                    <DashboardButtonItem name="Ustawienia konta" addr="/dashboard/user-profile"/>

                </main>

            </div>
        </div>
    );
}
