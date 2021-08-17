export default interface UseCase<T, K> {
  execute: (props: T) => K;
}
