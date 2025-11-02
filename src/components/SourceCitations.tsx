import { DocumentSource } from '../types/conversation';

interface SourceCitationsProps {
    sources: DocumentSource[];
}

/**
 * Displays source citations for assistant messages.
 * Shows only the document titles.
 *
 * @param sources - Array of document sources to display
 */
export function SourceCitations({ sources }: SourceCitationsProps) {
    if (!sources || sources.length === 0) {
        return null;
    }

    return (
        <div className="mt-3 border-t border-gray-200 pt-3">
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <span>📚</span>
                <span>Sources ({sources.length})</span>
            </h4>
            <ul className="space-y-1.5">
                {sources.map(source => (
                    <li
                        key={source.documentId}
                        className="flex items-center gap-2 text-sm text-gray-700"
                    >
                        <span className="text-sm">📄</span>
                        <span className="truncate">{source.documentTitle}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
