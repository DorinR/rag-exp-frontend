import { DocumentSource } from '../types/conversation';

interface SourceCitationsProps {
    sources: DocumentSource[];
}

/**
 * Displays source citations for assistant messages.
 * Shows document titles, relevance scores, and number of chunks used.
 * Sources darken slightly on hover for visual feedback.
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
            <ul className="space-y-2">
                {sources.map(source => (
                    <li
                        key={source.documentId}
                        className="flex items-start gap-2 rounded-md border border-gray-200 bg-white p-2 transition-colors hover:bg-gray-50"
                    >
                        <span className="mt-0.5 text-sm">📄</span>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-gray-900">
                                {source.documentTitle}
                            </div>
                            {source.fileName && source.fileName !== source.documentTitle && (
                                <div className="truncate text-xs text-gray-500">
                                    {source.fileName}
                                </div>
                            )}
                            <div className="mt-1 flex items-center gap-3 text-xs">
                                <span className="inline-flex items-center gap-1 text-gray-600">
                                    <span className="font-medium text-green-600">
                                        {(source.relevanceScore * 100).toFixed(0)}%
                                    </span>
                                    <span>relevant</span>
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600">
                                    {source.chunksUsed}{' '}
                                    {source.chunksUsed === 1 ? 'chunk' : 'chunks'}
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
