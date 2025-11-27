enum handlerComponentType {
    FREQUENCY = "FREQUENCY", //number
    ACTIVE = "ACTIVE", //boolean
}

type HandlerRequest = {
  type: string;
  payload: any;
};

export interface IHandlerRewardsConfig {
    component: handlerComponentType | string;
    value: number | boolean;
}

export type HandlerType = 'rewards' | 'config' | 'validators' | 'metrics' | 'notifications';

