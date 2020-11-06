export default function(val) {
    let str = '';
    if(val.trim() !== "") {
        val.split(" ").forEach((w) => {
            str += " " + w[0].toUpperCase() + w.slice(1)
        });
    }
    return str;
}