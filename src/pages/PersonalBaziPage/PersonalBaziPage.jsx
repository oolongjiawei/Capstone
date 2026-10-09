import './PersonalBaziPage.scss'; 
import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import BaziChart from '../../components/BaziChart/BaziChart';
import BaziFlow from '../../components/BaziFlow/BaziFlow.jsx';
import axios from 'axios';
import { MONTH_NAMES, formatHour } from '../../components/BaziInputModal/pickerUtils';
import { playRemove, playSlide } from '../../sound/mysticSound';

const formatBirth = (profile) =>
  `${MONTH_NAMES[profile.birth_month - 1]} ${profile.birth_day}, ${profile.birth_year} · ${formatHour(profile.birth_time)}`;

const PersonalBaziPage = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  // the profile just saved (from the home page) or edited here: expanded and marked
  const [highlight, setHighlight] = useState(
    state?.savedProfileId ? { id: state.savedProfileId, label: 'Saved ✓' } : null
  );
  const [expandedIds, setExpandedIds] = useState(() => new Set(state?.savedProfileId ? [state.savedProfileId] : []));
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/fortune/user/${userId}/profiles`);
        setProfiles(response.data);
        setStatus('ready');
      } catch (error) {
        console.error('Error fetching Bazi profiles:', error.response ? error.response.data : error.message);
        setStatus('error');
      }
    };

    if (userId) {
      fetchProfiles();
    }
  }, [userId]);

  // bring the highlighted profile into view
  useEffect(() => {
    if (status === 'ready' && highlight) {
      document.getElementById(`bazi-profile-${highlight.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status, highlight]);

  const toggleExpanded = (id) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = async (profile) => {
    try {
      await axios.delete(`http://localhost:8080/api/fortune/user/${userId}/profiles/${profile.id}`);
      setProfiles((current) => current.filter((p) => p.id !== profile.id));
      setError('');
    } catch (error) {
      console.error('Error deleting Bazi profile:', error.response ? error.response.data : error.message);
      setError(`Couldn't delete ${profile.name}'s profile. Please try again.`);
    }
  };

  // save an edited profile: the server recalculates the chart from the new details
  const handleSaveEdit = async (baziData) => {
    const response = await axios.put(`http://localhost:8080/api/fortune/user/${userId}/profiles/${editing.id}`, {
      name: baziData.name,
      birthYear: baziData.birth_year,
      birthMonth: baziData.birth_month,
      birthDay: baziData.birth_day,
      birthTime: baziData.birth_time,
    });
    const updated = response.data.bazi;
    setProfiles((current) => current.map((p) => (p.id === updated.id ? updated : p)));
    setExpandedIds((current) => new Set(current).add(updated.id));
    setHighlight({ id: updated.id, label: 'Updated ✓' });
    setEditing(null);
  };

  return (
    <>
      <Header onLogoClick={() => {}} /> 
      <div className="cookies-page">
        <div className="cookies__all">
          {status === 'loading' && <p>Loading your Bazi profiles...</p>}
          {status === 'error' && <p className="error-message">Couldn&apos;t load your Bazi profiles. Please refresh to try again.</p>}
          {status === 'ready' && profiles.length === 0 && (
            <div className="bazi-page__empty">
              <h2>No Bazi profiles yet.</h2>
              <p>Tap the lucky cat, enter a name and birth date, then press &quot;Save Profile&quot;.</p>
              <Link to={`/user/${userId}`} className="bazi-page__cta">Go to the lucky cat</Link>
            </div>
          )}
          {status === 'ready' && profiles.length > 0 && (
            <>
              <div className="bazi-page__header">
                <h2>Bazi Profiles <span className="bazi-page__count">{profiles.length}</span></h2>
                <Link to={`/user/${userId}`} className="bazi-page__cta">+ Add a person</Link>
              </div>
              {error && <p className="error-message">{error}</p>}
              <ul className="bazi-page__list">
                {profiles.map((profile) => {
                  const isExpanded = expandedIds.has(profile.id);
                  const isHighlighted = highlight?.id === profile.id;
                  return (
                    <li
                      key={profile.id}
                      id={`bazi-profile-${profile.id}`}
                      className={`bazi-profile ${isExpanded ? 'is-expanded' : ''} ${isHighlighted ? 'is-new' : ''}`}
                    >
                      <button
                        type="button"
                        className="bazi-profile__summary"
                        aria-expanded={isExpanded}
                        aria-controls={`bazi-profile-details-${profile.id}`}
                        onClick={() => {
                          playSlide(!isExpanded);
                          toggleExpanded(profile.id);
                        }}
                        data-sound="custom"
                      >
                        <span className="bazi-profile__heading">
                          <span className="bazi-profile__name">{profile.name}</span>
                          <span className="bazi-profile__birth">{formatBirth(profile)}</span>
                        </span>
                        {isHighlighted && <span className="bazi-page__notice">{highlight.label}</span>}
                        <span className="bazi-profile__chevron" aria-hidden="true" />
                      </button>
                      {isExpanded && (
                        <div id={`bazi-profile-details-${profile.id}`} className="bazi-profile__details">
                          <BaziChart baziData={profile} />
                          <div className="bazi-profile__actions">
                            <button
                              type="button"
                              className="bazi-profile__edit"
                              onClick={() => setEditing(profile)}
                              aria-label={`Edit ${profile.name}'s details and regenerate the chart`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="bazi-profile__delete"
                              onClick={() => {
                                playRemove();
                                handleDelete(profile);
                              }}
                              data-sound="custom"
                              aria-label={`Delete ${profile.name}'s Bazi profile`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
      {editing && (
        <BaziFlow
          key={editing.id}
          isOpen
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
          initialValues={editing}
          inputTitle={`Edit ${editing.name}`}
          generateLabel="Regenerate Bazi"
          saveLabel="Save changes"
        />
      )}
    </>
  );
};

export default PersonalBaziPage;
