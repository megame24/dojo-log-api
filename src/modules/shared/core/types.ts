export interface UseCase<T, K> {
  execute: (props: T) => K;
}
