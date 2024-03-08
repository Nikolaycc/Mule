import React, { useState } from "react";

export default function Page() {
    // Declare a new state variable, which we'll call "count"
    let count = 3;

    return (
        <body>
            <div>
                <p>You clicked {count} times</p>
                <button onClick={() => console.log(count)}>Click me</button>
            </div>
        </body>
    );
}
