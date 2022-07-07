export interface UseCaseConfig {
  mode?: string;
}

export default interface UseCase<T, K> {
  execute: (props: T, config?: UseCaseConfig) => K;
}
