import { TransactionsByID } from "@/components/ui/transactionsByID";

export default async function TransactionsByIDPage({ params }) {
    const {id}=await params;
    console.log("Id is",id)
    return(
        <div>   
            <TransactionsByID id={id}/>
        </div>
    )
}