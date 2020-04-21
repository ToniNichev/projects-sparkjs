import React from 'react';
import { shallow } from 'enzyme';
import Home from './index';
import toJson from 'enzyme-to-json';
describe('Testing Home component', () => {
    it('renders as expected!', () => {
      const wrapper = shallow(
        <Home title="Title test" />
      );
     expect(toJson(wrapper)).toMatchSnapshot();
   });
});