let db;
//creates a new db called "budgetNEW" database
const request = indexedDB.open("budgetNEW", 1);

request.onupgradeneeded = function(event) {
    //creates an object store called pending and set autoIncrement to true
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    //checks to see if app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
};

//error reporting
request.onerror = function (event) {
    console.log("PROBLEM! " + event.target.errorCode);
};

//function to save record into db
function saveRecord(record) {
    //creates a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);    
};

//function that allows for read-write access to pending and gets records from store and 
//stores them to a variable
function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            });
        }
    };
}

//listen for app coming back online
window.addEventListener("online", checkDatabase);
