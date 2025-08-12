// Ensure the settings object exists
if (typeof indexedDB_settings !== 'undefined') {
    let updateInterval;

    // Initial load and setup periodic checking
    (async function initializePostsDatabase() {
        await checkAndUpdatePosts();

        // Set up interval to check for updates every 30 minutes (1800000 ms)
        updateInterval = setInterval(checkAndUpdatePosts, 30 * 60 * 1000);
        // console.log('IndexedDB auto-update scheduled every 30 minutes');
    })();

    // Function to check for updates and update if needed
    async function checkAndUpdatePosts() {
        try {
            // First, get the current hash from server
            const hashResponse = await fetch(indexedDB_settings.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: new URLSearchParams({
                    action: indexedDB_settings.action,
                    nonce: indexedDB_settings.nonce,
                    hash_only: 'true'
                })
            });
            const hashData = await hashResponse.json();

            if (!hashData.success) {
                console.error('Failed to fetch hash:', hashData);
                return;
            }

            const serverHash = hashData.data.hash;
            const storedHash = localStorage.getItem('posts_data_hash');

            // console.log('Server hash:', serverHash);
            // console.log('Stored hash:', storedHash);

            // If hashes don't match, fetch and update the data
            if (serverHash !== storedHash) {
                // console.log('Data has changed, updating IndexedDB...');

                const response = await fetch(indexedDB_settings.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: new URLSearchParams({
                        action: indexedDB_settings.action,
                        nonce: indexedDB_settings.nonce
                    })
                });
                const data = await response.json();

                if (data.success && data.data && Array.isArray(data.data.posts)) {
                    await storePostsInIndexedDB(data.data.posts);
                    // Store the new hash
                    localStorage.setItem('posts_data_hash', data.data.hash);
                    localStorage.setItem('posts_last_updated', data.data.last_updated || Date.now());
                    // console.log('IndexedDB updated successfully with new data');
                } else {
                    // console.log('IndexedDB AJAX Data:', data);
                }
            } else {
                // console.log('Data is up to date, no update needed');
            }
        } catch (error) {
            console.error('Error checking for IndexedDB updates:', error);
        }
    }

    // Function to manually trigger an update (can be called from console)
    window.updatePostsDatabase = checkAndUpdatePosts;

} else {
    console.error('indexedDB_settings is not defined.');
}

// Async function to store posts in IndexedDB
async function storePostsInIndexedDB(posts) {
    const dbName = 'PostsDatabase';
    const storeName = 'posts';

    // Open IndexedDB as a promise
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onupgradeneeded = function (event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
            request.onerror = function (event) {
                reject(event.target.errorCode);
            };
        });
    }

    // Clear store as a promise
    function clearStore(db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const clearRequest = store.clear();
            clearRequest.onsuccess = () => resolve(transaction);
            clearRequest.onerror = (e) => reject(e);
        });
    }

    // Add posts in batches as a promise
    function addPostsBatch(db, postsBatch) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            postsBatch.forEach(post => store.put(post));
            transaction.oncomplete = () => resolve();
            transaction.onerror = (e) => reject(e);
        });
    }

    try {
        const db = await openDB();
        await clearStore(db);

        const batchSize = 100;
        const totalPosts = posts.length;
        console.log(`Processing ${totalPosts} posts - first ${batchSize} immediately, then remaining in batches...`);

        // Store the first 100 posts immediately for quick access
        if (totalPosts > 0) {
            const firstBatch = posts.slice(0, batchSize);
            await addPostsBatch(db, firstBatch);
            console.log(`First batch of ${firstBatch.length} posts stored immediately for quick access`);
        }

        // Process remaining posts in background with delay
        if (totalPosts > batchSize) {
            const remainingPosts = posts.slice(batchSize);
            let currentIndex = 0;

            const processRemainingBatches = async () => {
                while (currentIndex < remainingPosts.length) {
                    const batch = remainingPosts.slice(currentIndex, currentIndex + batchSize);
                    await addPostsBatch(db, batch);
                    currentIndex += batchSize;

                    const totalProcessed = Math.min(batchSize + currentIndex, totalPosts);
                    console.log(`Background batch processed: ${totalProcessed}/${totalPosts} posts stored`);

                    // Wait 300ms before processing next batch (unless it's the last batch)
                    if (currentIndex < remainingPosts.length) {
                        await new Promise(resolve => setTimeout(resolve, 300));
                    }
                }
                console.log('All posts stored in IndexedDB successfully.');
            };

            // Start background processing without awaiting
            processRemainingBatches().catch(e => {
                console.error('Error in background batch processing:', e);
            });
        } else {
            console.log('All posts stored in IndexedDB successfully.');
        }
    } catch (e) {
        console.error('Error storing posts in IndexedDB:', e);
    }
}