import { REPO_ARCHIVE_B64 } from "../data/repoArchive";

export function downloadProjectArchive(filename = "shark-ui.tar.gz"): void {
  try {
    const byteCharacters = atob(REPO_ARCHIVE_B64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/gzip" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error("Failed to download embedded archive, falling back to network URL:", err);
    const fallbackLink = document.createElement("a");
    fallbackLink.href = "/shark-ui.tar.gz";
    fallbackLink.download = filename;
    fallbackLink.click();
  }
}
