import useSWRMutation from 'swr/mutation';

type DeleteTransactionArgs = { id: string };

export function useDeleteTransaction() {
  return useSWRMutation(
    '/api/transactions',
    async (url: string, { arg }: { arg: DeleteTransactionArgs }) => {
      const res = await fetch(`${url}/${arg.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!res.ok) {
        let errorMessage = 'Erro ao deletar';
        try {
          const error = await res.json();
          errorMessage = error?.error || errorMessage;
        } catch {
          // Caso a resposta não tenha JSON
        }
        throw new Error(errorMessage);
      }

      // Verifica se há conteúdo na resposta
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return res.json();
      }

      return null; // ou `true`, dependendo do que o backend retorna
    }
  );
}
