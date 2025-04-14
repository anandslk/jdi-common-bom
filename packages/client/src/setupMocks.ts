/**
 * Mock Setup for Local Development
 */
if (!(window as any).widget) {
  console.log("[Local Mock] Creating mock widget object...");

  const Widget = function (this: any) {
    const events: Record<string, Function> = {};

    this.uwaUrl = (window as any).location.origin + "/";

    this.addEvent = (event: string, callback: () => void) => {
      console.log(`[Local Mock] Event registered: ${event}`);
      events[event] = callback;
      if (event === "onLoad") {
        if (document.readyState === "loading") {
          window.addEventListener("DOMContentLoaded", callback);
        } else {
          callback();
        }
      }
    };

    this.setTitle = (title: string) => {
      document.title = title;
    };

    this.dispatchEvent = (event: string, data?: any) => {
      console.log(`[Local Mock] Dispatching event: ${event} with data:`, data);
      if (events[event]) events[event](data);
    };
  };

  (window as any).widget = new (Widget as any)();
  console.log("[Local Mock] Mock widget created:", (window as any).widget);
}

// Mock `define` function for RequireJS
if (typeof (window as any).define === "undefined") {
  console.log("[Local Mock] Mocking define function...");
  (window as any).define = (name: any, deps: any, callback: any) => {
    if (typeof deps === "function") {
      callback = deps;
    }
    console.log(`[Local Mock] Defining module: ${name}`);
    if (name === "DS/DataDragAndDrop/DataDragAndDrop") {
      callback((window as any).DataDragAndDrop);
    } else if (name === "DS/WAFData/WAFData") {
      callback((window as any).WAFData);
    } else {
      callback({});
    }
  };
  (window as any).define.amd = true;
}

// Mock `require` function
if (!(window as any).require) {
  console.log("[Local Mock] Creating mock require function...");
  (window as any).require = (modules: any, callback: any) => {
    console.log("[Local Mock] Resolving modules:", modules);
    const resolvedModules = modules.map((module: any) => {
      if (module === "DS/WAFData/WAFData") return (window as any).WAFData;
      if (module === "DS/DataDragAndDrop/DataDragAndDrop")
        return (window as any).DataDragAndDrop;
      return {};
    });
    callback(...resolvedModules);
  };
}

// Mock `WAFData`
if (!(window as any).WAFData) {
  console.log("[Local Mock] Mocking WAFData...");
  (window as any).WAFData = {
    authenticatedRequest: (url: any, options: any) => {
      console.log(
        `[Local Mock] WAFData.authenticatedRequest called with URL: ${url}`,
        options,
      );
      setTimeout(() => {
        if (url.includes("CSRF")) {
          options.onComplete &&
            options.onComplete({
              csrf: { name: "mock-csrf-token", value: "mock-csrf-value" },
            });
        } else {
          options.onComplete &&
            options.onComplete({ mockData: "Sample response data" });
        }
      }, 300); // Simulate delay for realistic testing
    },
  };
}

// Mock `DataDragAndDrop`
if (!(window as any).DataDragAndDrop) {
  console.log("[Local Mock] Mocking DataDragAndDrop...");
  (window as any).DataDragAndDrop = {
    droppable: (element: any, callbacks: any) => {
      console.log("[Local Mock] Initializing droppable area:", element);
      element.addEventListener("dragenter", (e: any) => {
        e.preventDefault();
        callbacks.enter && callbacks.enter(e);
      });
      element.addEventListener("dragleave", (e: any) => {
        e.preventDefault();
        callbacks.leave && callbacks.leave(e);
      });
      element.addEventListener("drop", (e: any) => {
        e.preventDefault();
        const mockData = JSON.stringify({
          data: {
            items: [{ objectId: "mock-object-id", displayName: "Mock Object" }],
          },
        });
        callbacks.drop && callbacks.drop(mockData);
      });
    },
  };
}

console.log("[Local Mock] Environment initialized successfully.");
