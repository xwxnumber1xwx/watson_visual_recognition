import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'capitalize';
import jpath from 'jpath-query';
import JsonComponemnt from './JsonComponent';
import ClassifiedImage from './ClassifiedImage';
import Table from './Table';

const FACE_LOCATIONS = [];
const DOC_LINKS = {
  default: 'https://cloud.ibm.com/apidocs/visual-recognition#classify-an-image',
};

/**
 * Convert array of key pair values to
 * use array format for elements in rows
 * @param {Object} keys Key Value Pairs of Classes and Scores
 */
const keyPairsToArrayFormat = (keys) => {
  const result = [];
  keys.map(i => (
    result.push([i.class || i.word, i.score])),
  );
  return result;
};

/**
 * Returns top N elements of list
 * @param {Array} data Data to be sorted
 * @param {Number} n N number of elemets to return
 */
const topN = (data, n) => (data.sort((p1, p2) => (p2.score - p1.score)).slice(0, n));

/**
 * Returns true if the classifier is not empty or `non-food`.
 * @param {Object} classifier The results of a classifier an image
 */
const emptyClassifiers = classifier => (
  (classifier.data.length > 0 && !(classifier.data.length === 1 && classifier.data[0].class === 'non-food'))
);

/**
 * Gets the documentation link for desired classifier
 * @param {string} className Name of Classifier
 */
const getDocLink = className => (
  DOC_LINKS.className || DOC_LINKS.default
);

export default class Output extends React.Component {
  constructor(props) {
    super(props);

    const classifiers = [
      { name: 'tags', data: jpath.jpath('/images/0/classifiers/0/classes', props.data, []) },
      { name: 'food', data: jpath.jpath('/images/0/classifiers/1/classes', props.data, []) },
    ];

    const tags = jpath.jpath('/images/0/classifiers/0', props.data);
    if (tags && tags.name === 'food') {
      classifiers[0] = { name: 'tags', data: jpath.jpath('/images/0/classifiers/1/classes', props.data, []) };
      classifiers[1] = { name: 'food', data: jpath.jpath('/images/0/classifiers/0/classes', props.data, []) };
    }

    this.state = {
      show: false,
      classifiers,
    };

    this.onShow = this.onShow.bind(this);
  }

  onShow() {
    this.setState({ show: !this.state.show });
  }

  render() {
    return (
      <div className="_container _container_large">
        {this.props.data ? (
          <div>
            <h2>Watson sees...</h2>
            <ClassifiedImage image={this.props.image} boxes={FACE_LOCATIONS} />
            <div className="result--container">
              {this.state.classifiers.filter(i => emptyClassifiers(i)).map(item => (
                <div key={item.name} className="json--container">
                  <JsonComponemnt
                    item={item}
                    description={<p>{capitalize.words(item.name)} (Go to <a href={getDocLink(item.name)}>docs</a>)</p>}
                  />
                  <Table
                    header={['Top Ten Classes', 'Score']}
                    rows={keyPairsToArrayFormat(topN(item.data, 10))}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

Output.defaultProps = {
  data: null,
  image: null,
};

Output.propTypes = {
  data: PropTypes.object, // eslint-disable-line
  image: PropTypes.object, // eslint-disable-line
};
